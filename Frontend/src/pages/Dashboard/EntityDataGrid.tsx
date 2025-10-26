import { DataGrid, type GridPaginationModel } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import type { EntityConfig } from "../../lib/entities/types";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { viVN } from "@mui/x-data-grid/locales";
import SearchBar from "../../components/SearchBar";
import { useSearchParams } from "react-router-dom";

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

  if(error) {
    return <div>Lỗi tải dữ liệu: {(error as Error).message}</div>;
  }

  console.log("Fetched data:", data);
  const rowCount = data?.total || 0;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => await config.api.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [config.name, search, page, limit],
      });
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

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SearchBar
          onSearch={(query) => handleSearch(query)}
        />
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
      <DataGrid
        getRowId={config.idKey ? (row) => row[config.idKey] : undefined}
        rows={data?.data || []}
        columns={config?.getColumns({
          onEdit: (value) =>
            navigate(`/dashboard/${config.name}/edit/${value[config.idKey]}`),
          onDelete: (value) => {
            mutation.mutate(value[config.idKey]);
          },
        })}
        loading={isLoading}
        paginationModel={{
          page: page - 1,
          pageSize: limit
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
