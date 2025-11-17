import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { viVN } from "@mui/x-data-grid/locales";
import SearchBar from "../../../components/SearchBar";
import { useState } from "react";

interface ReportTableProps {
  queryKey: string;
  queryFn: (params: {
    keyword: string;
    page: number;
    limit: number;
  }) => Promise<any>;
  monthYear: string;
  columns: GridColDef[];
  idKey: string;
  title?: string;
}

const DEFAULT_PAGE_SIZE = 10;

export default function ReportTable({
  queryKey,
  queryFn,
  monthYear,
  columns,
  idKey,
  title,
}: ReportTableProps) {
  if (!columns) {
    return <div>Bảng báo cáo chưa được cấu hình!</div>;
  }

  const [search, SetSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: [
      queryKey,
      monthYear,
      search,
      paginationModel.page,
      paginationModel.pageSize,
    ],
    queryFn: async () =>
      await queryFn({
        keyword: search,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  if (error) {
    return <div>Lỗi tải dữ liệu: {(error as Error).message}</div>;
  }

  const rowCount = data?.total || 0;

  const handleSearch = (query: string) => {
    SetSearch(query);
    setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <Box sx={{ mt: 2, width:"fit-content", maxWidth: "100%" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Bảng báo cáo chi tiết {title ? `${title}` : ""}
      </Typography>
      <SearchBar onSearch={(query) => handleSearch(query)} />
      <DataGrid
        sx={{
            my: 2
        }}
        getRowId={idKey ? (row) => row[idKey] : undefined}
        rows={data?.data || []}
        columns={columns}
        loading={isLoading}
        paginationModel={paginationModel}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[10, 25, 50]}
        onPaginationModelChange={(model: GridPaginationModel) =>
          setPaginationModel(model)
        }
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}
