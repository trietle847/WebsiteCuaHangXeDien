import {
  DataGrid,
  type GridRowSelectionModel,
  type GridPaginationModel,
} from "@mui/x-data-grid";
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
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDialogActions } from "../../context/DialogContext";
import { useSelectionActions } from "../../context/SelectionContext";

interface EntityDataGridProps {
  config: EntityConfig;
  customPath?: string;
}

const DEFAULT_PAGE_SIZE = 10;

export default function EntityDataGrid({
  config,
  customPath,
}: EntityDataGridProps) {
  if (!config) {
    return <div>Entity config not found</div>;
  }

  const selectionRef = useRef<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const { setSelection } = useSelectionActions();

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

  const navigate = useNavigate();

  // ✅ Chỉ subscribe ACTIONS - Không re-render khi dialog state thay đổi
  const { openDialog, closeDialog } = useDialogActions();

  const onView = useCallback(
    (element: any) => {
      openDialog({
        title: element.title,
        content: element?.content,
        onConfirm: element?.quickUpdate
          ? (formData?: any) => {
              customMutation.mutate({
                fn: element.quickUpdate!,
                id: element.id!,
                data: formData,
              });
              closeDialog();
            }
          : undefined,
      });
    },
    [openDialog, closeDialog, customMutation]
  );

  const onDelete = useCallback(
    (item: any) => {
      openDialog({
        title: `Xác nhận xóa ${config.label}`,
        content: (
          <DialogContentText>
            Bạn có chắc chắn muốn xóa {config.label.toLowerCase()} này không?
          </DialogContentText>
        ),
        onConfirm: () => {
          deleteMutation.mutate(item[config.idKey]);
          closeDialog();
        },
      });
    },
    [openDialog, closeDialog, config.label, config.idKey, deleteMutation]
  );

  const memoizedColumns = useMemo(
    () =>
      config.getColumns({
        onEdit: (value) =>
          customPath
            ? navigate(`/dashboard/${customPath}/edit/${value[config.idKey]}`)
            : navigate(`/dashboard/${config.name}/edit/${value[config.idKey]}`),
        onDelete,
        onView,
      }),
    [config, onDelete, onView, navigate, customPath]
  );

  const handleSelectionChange = useCallback(() => {
    const currentSelection = selectionRef.current;

    // Chuyển đổi sang Set of IDs
    let selectedIdsSet: Set<number | string>;
    if (typeof currentSelection === "object" && "type" in currentSelection) {
      selectedIdsSet = currentSelection.ids;
    } else {
      selectedIdsSet = new Set(currentSelection as any);
    }

    // Chỉ filter data khi thực sự cần (có selectContent)
    const selectedData = data?.data
      ? typeof currentSelection === "object" && "type" in currentSelection
        ? currentSelection.type === "include"
          ? data.data.filter((item: any) =>
              currentSelection.ids.has(item[config.idKey])
            )
          : data.data.filter(
              (item: any) => !currentSelection.ids.has(item[config.idKey])
            )
        : data.data.filter((item: any) =>
            (currentSelection as any).includes(item[config.idKey])
          )
      : [];

    setSelection(selectedIdsSet, selectedData);
  }, [data?.data, config.idKey, setSelection]);

  useEffect(() => {
    if (!config.selectContent || !data?.data) return;
    handleSelectionChange();
  }, [data?.data, config.selectContent, handleSelectionChange]);

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SearchBar onSearch={(query) => handleSearch(query)} />
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          {config.selectContent && config.selectContent()}
          {config.permission?.create && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={
                customPath
                  ? `/dashboard/${customPath}/new`
                  : `/dashboard/${config.name}/new`
              }
            >
              + Thêm mới
            </Button>
          )}
        </Box>
      </Box>

      <ToastContainer autoClose={3000} />

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
        checkboxSelection={!!config.selectContent}
        onRowSelectionModelChange={(newSelection) => {
          selectionRef.current = newSelection;
          handleSelectionChange();
        }}
        disableRowSelectionOnClick
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}
