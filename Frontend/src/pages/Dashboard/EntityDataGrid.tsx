import { DataGrid, type GridPaginationModel } from "@mui/x-data-grid";
import { Box, Button, DialogContentText } from "@mui/material";
import type { EntityConfig } from "../../lib/entities/config/types";
import { Link, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { viVN } from "@mui/x-data-grid/locales";
import SearchBar from "../../components/SearchBar";
import { useSearchParams } from "react-router-dom";
import {
  useCallback,
  useState,
  type JSX,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { ToastContainer, toast } from "react-toastify";
const ContentDialog = lazy(() =>
  import("../../components/dialog/ContentDialog").then((module) => ({
    default: module.default,
  }))
);

interface EntityDataGridProps {
  config: EntityConfig;
}

const DEFAULT_PAGE_SIZE = 10;

export default function EntityDataGrid({ config }: EntityDataGridProps) {
  if (!config) {
    return <div>Entity config not found</div>;
  }

  // --- Đọc trực tiếp từ URL ---
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get(config.searchKey || "search") || ""; // Lấy từ khóa tìm kiếm
  const page = parseInt(searchParams.get("page") || "1", 10); // Lấy trang (1-based)
  const limit = parseInt(
    searchParams.get("limit") || `${DEFAULT_PAGE_SIZE}`,
    10
  ); // Lấy giới hạn

  const { data, isLoading, error } = useQuery({
    queryKey: [config.name, search, page, limit],
    queryFn: async () =>
      await config.api.getAll({
        keyword: search,
        page,
        limit,
      }),
    placeholderData: keepPreviousData,
  });

  if (error) {
    return <div>Lỗi tải dữ liệu: {(error as Error).message}</div>;
  }

  const rowCount = data?.total || 0;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await config.api.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [config.name, search, page, limit],
      });
      toast.success(response.message || "Xóa thành công");
    },
    onError: (error) => {
      toast.error(`Xóa thất bại: ${(error as Error).message}`);
    },
  });

  const customMutation = useMutation({
    mutationFn: async (payload: {
      fn: (id: number, data?: any) => Promise<any>;
      id: number;
      data?: any;
    }) => {
      return payload.data
        ? payload.fn(payload.id, payload.data)
        : payload.fn(payload.id);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [config.name] });

      // Nếu cập nhật đơn hàng, cũng cần invalidate products để cập nhật tồn kho
      if (config.name === "orders") {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }

      toast.success(response?.message || "Thao tác thành công");
    },
    onError: (error) => {
      toast.error(`Thao tác thất bại: ${(error as Error).message}`);
    },
  });

  // --- Hàm cập nhật URL bằng setSearchParams ---
  const handlePaginationChange = (model: GridPaginationModel) => {
    const params = new URLSearchParams(searchParams); // Lấy params hiện tại
    params.set("page", (model.page + 1).toString()); // Cập nhật page (1-based)
    params.set("limit", model.pageSize.toString()); // Cập nhật limit
    setSearchParams(params, { replace: true });
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set(config.searchKey || "search", query);
    } else {
      params.delete(config.searchKey || "search"); // Xóa param nếu query rỗng
    }
    params.set("page", "1"); // Luôn về trang 1 khi tìm kiếm
    setSearchParams(params, { replace: true });
  };

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    content?: JSX.Element | null;
    onConfirm?: ((data?: any) => void) | null;
  }>({
    open: false,
    title: "",
    content: null,
    onConfirm: null,
  });

  const closeDialog = useCallback(() => {
    setDialogState((prevState) => ({
      ...prevState,
      open: false,
      onConfirm: null,
    }));
  }, []);

  const navigate = useNavigate();

  const onView = useCallback(
    (element: any) => {
      setDialogState({
        open: true,
        title: element?.title || "",
        content: element?.content || null,
        onConfirm: element?.quickUpdate
          ? (formData?: any) => {
              customMutation.mutate({
                fn: element.quickUpdate!,
                id: element.id!,
                data: formData,
              });
              closeDialog();
            }
          : null,
      });
    },
    [setDialogState, customMutation, closeDialog, config]
  );

  const onDelete = useCallback(
    (item: any) => {
      setDialogState({
        open: true,
        title: `Xóa ${config.label.toLowerCase()}`,
        content: (
          <DialogContentText sx={{ maxWidth: 600 }}>
            {`Xác nhận xóa ${config.label.toLowerCase()} này? Hành động này không thể hoàn tác.`}
          </DialogContentText>
        ),
        onConfirm: () => {
          deleteMutation.mutate(item[config.idKey]);
          closeDialog();  
        },
      });
    },
    [setDialogState, deleteMutation, config.label, config.idKey]
  );

  const memoizedColumns = useMemo(
    () =>
      config.getColumns({
        onEdit: (value) =>
          navigate(`/dashboard/${config.name}/edit/${value[config.idKey]}`),
        onDelete,
        onView,
      }),
    [config, onDelete, onView, navigate]
  );

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SearchBar onSearch={(query) => handleSearch(query)} />
        {config.permission?.create && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/dashboard/${config.name}/new`}
          >
            Thêm mới
          </Button>
        )}
      </Box>

      <ToastContainer autoClose={3000} />

      <Suspense fallback={<div>Đang tải...</div>}>
        <ContentDialog {...dialogState} onClose={() => closeDialog()} />
      </Suspense>
      <DataGrid
        getRowId={config.idKey ? (row) => row[config.idKey] : undefined}
        rows={data?.data || []}
        columns={memoizedColumns}
        loading={isLoading}
        paginationModel={{
          page: page - 1,
          pageSize: limit,
        }}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[10, 25, 50]}
        onPaginationModelChange={(model) => handlePaginationChange(model)}
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}
