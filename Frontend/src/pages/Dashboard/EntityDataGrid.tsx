import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import type { EntityConfig } from "../../lib/entities/types";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { viVN } from "@mui/x-data-grid/locales";
import SearchBar from "../../components/SearchBar";
import { useEffect, useState } from "react";

interface EntityDataGridProps {
  config: EntityConfig;
}

export default function EntityDataGrid({ config }: EntityDataGridProps) {
  if (!config) {
    return <div>Entity config not found</div>;
  }

  const { data} = useQuery(
    {
      queryKey: [config.name],
      queryFn: async () => await config.api.getAll(),
    }
  );
  const [filteredData, setFilteredData] =  useState(data?.data);
  useEffect(() => {
    setFilteredData(data?.data);
  }, [data]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => await config.api.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.name] });
    },
  });

  const navigate = useNavigate();

  return (
    <Box>
      {config.permission?.create && (
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <SearchBar onSearch={(query)=>{
            setFilteredData(data?.data.filter((item: any) => item.name.toLowerCase().includes(query.toLowerCase())));
          }}/>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/dashboard/${config.name}/new`}
          >
            Thêm mới
          </Button>
        </Box>
      )}
      <DataGrid
        getRowId={config.idKey ? (row) => row[config.idKey] : undefined}
        rows={filteredData || []}
        columns={config?.getColumns({
          onEdit: (value) => navigate(`/dashboard/${config.name}/edit/${value[config.idKey]}`),
          onDelete: (value) => {
            console.log("Deleting item:", value);
            mutation.mutate(value[config.idKey])},
        })}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          }
        }}
        pageSizeOptions={[10,25,50]}
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}
