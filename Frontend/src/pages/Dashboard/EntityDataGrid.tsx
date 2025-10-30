import { DataGrid, type GridPaginationModel } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
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
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface EntityDataGridProps {
  config: EntityConfig;
}

interface ContentDialogProps {
  open: boolean;
  title: string;
  Content?: React.ReactNode | null;
  onConfirm?: () => void | null;
  onClose: () => void;
}

const ContentDialog = ({
  open,
  title,
  Content,
  onConfirm,
  onClose,
}: ContentDialogProps) => {
  return (
    <Dialog maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>{Content}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            bgcolor: "gray",
            "&:hover": { bgcolor: "darkgray" },
          }}
        >
          Đóng
        </Button>
        {onConfirm && (
          <Button
            variant="contained"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "red",
              },
            }}
          >
            Xác nhận
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

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

  const activateMutation = useMutation({
    mutationFn: (id: number) =>
      config.api.activate ? config.api.activate(id) : Promise.resolve(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [config.name, search, page, limit],
      });
      toast.success(response.message || "Kích hoạt thành công");
    },
    onError: (error) => {
      toast.error(`Kích hoạt thất bại: ${(error as Error).message}`);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) =>
      config.api.deactivate ? config.api.deactivate(id) : Promise.resolve(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [config.name, search, page, limit],
      });
      toast.success(response.message || "Vô hiệu hóa thành công");
    },
    onError: (error) => {
      toast.error(`Vô hiệu hóa thất bại: ${(error as Error).message}`);
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogOnConfirm, setDialogOnConfirm] = useState<(() => void | null) | undefined>(undefined);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);

  const navigate = useNavigate();

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
      <ContentDialog
        open={dialogOpen}
        title={dialogTitle}
        Content={dialogContent}
        onConfirm={dialogOnConfirm}
        onClose={() => setDialogOpen(false)}
      />
      <DataGrid
        getRowId={config.idKey ? (row) => row[config.idKey] : undefined}
        rows={data?.data || []}
        columns={config?.getColumns({
          onEdit: (value) =>
            navigate(`/dashboard/${config.name}/edit/${value[config.idKey]}`),
          onDelete: (value) => {
            setDialogTitle(`Xóa ${config.label.toLowerCase()}`);
            setDialogContent(
              <Box>
                <DialogContentText>
                  {`Bạn có chắc muốn xóa ${config.label.toLowerCase()} này không?`}
                </DialogContentText>
                <DialogContentText>
                  {`Hành động này sẽ khiến ${config.label.toLowerCase()} được chọn
                  không còn hiển thị trên hệ thống. Nhưng các dữ liệu hay giao
                  dịch có liên quan vẫn được giữ lại để đảm bảo tính toàn vẹn
                  của hệ thống.`}
                </DialogContentText>
              </Box>
            );
            setDialogOnConfirm(
              () => () => deleteMutation.mutate(value[config.idKey])
            );
            setDialogOpen(true);
          },
          onActivate: (value) => {
            setDialogTitle(`Kích hoạt tài khoản ${config.label.toLowerCase()}`);
            setDialogContent(
              <DialogContentText>
                {`Xác nhận kích hoạt tài khoản ${config.label.toLowerCase()} này?
                Tài khoản được kích hoạt sẽ có thể đăng nhập và sử dụng hệ thống.`}
              </DialogContentText>
            );
            setDialogOnConfirm(
              () => () => activateMutation.mutate(value[config.idKey])
            );
            setDialogOpen(true);
          },
          onDeactivate: (value) => {
            setDialogTitle(
              `Vô hiệu hóa tài khoản ${config.label.toLowerCase()}`
            );
            setDialogContent(
              <DialogContentText>
                {`Xác nhận vô hiệu hóa tài khoản ${config.label.toLowerCase()} này?
                Tài khoản bị vô hiệu hóa sẽ không thể đăng nhập và sử dụng hệ thống cho đến khi được kích hoạt lại.`}
              </DialogContentText>
            );
            setDialogOnConfirm(
              () => () => deactivateMutation.mutate(value[config.idKey])
            );
            setDialogOpen(true);
          },
          onView: (element) => {
            setDialogTitle(element?.title || "");
            setDialogContent(element?.content || null);
            setDialogOnConfirm(undefined);
            setDialogOpen(true);
          }
        })}
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
