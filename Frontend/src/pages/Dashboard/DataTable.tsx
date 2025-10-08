import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { EditNote, Delete } from "@mui/icons-material";
import { createTable } from "./displayConfig";
import AddItemDialog from "../../components/dialog/AddItemDialog";
import UpdateItemDialog from "../../components/dialog/UpdateItemDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface DataTableProps {
  displayConfig: ReturnType<typeof createTable>;
}

export default function DataTable({ displayConfig }: DataTableProps) {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const queryClient = useQueryClient();

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const api = displayConfig.formConfig.api;
  const config = displayConfig.formConfig;

  const { data, isLoading, error } = useQuery({
    queryKey: [config.name],
    queryFn: () => api.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => {
      if (!confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
        return Promise.reject("User cancelled deletion");
      }
      return api.delete(id);
    },
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: [config.name] });
    },
  });

  return (
    <Box width={"100%"}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
          sx={{
            minWidth: 150,
            bgcolor: "#26b170",
            "&:hover": { bgcolor: "#219162" },
          }}
        >
          Thêm sản phẩm
        </Button>
        <AddItemDialog
          open={openAddDialog}
          handleClose={() => setOpenAddDialog(false)}
          config={config}
          api={api}
        />
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell padding="checkbox" sx={{ fontWeight: "bold" }}>
                <Checkbox />
              </TableCell>
              {displayConfig.columns.map((col: any) => (
                <TableCell key={col.key} sx={{ fontWeight: "bold" }}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.data.map((item: any) => (
                <TableRow key={item[displayConfig.idName]}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  {displayConfig.columns.map((col: any) => (
                    <TableCell key={`${item[displayConfig.idName]}_${col.key}`}>
                      {item[col.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Tooltip title={"Cập nhật"}>
                      <IconButton
                        sx={{ "&:hover": { color: "#1565c0" } }}
                        onClick={() => {
                          setSelectedItem(item);
                          setOpenUpdateDialog(true);
                        }}
                      >
                        <EditNote />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={"Xóa"}>
                      <IconButton
                        sx={{ "&:hover": { color: "#d32f2f" } }}
                        onClick={() =>
                          deleteMutation.mutate(item[displayConfig.idName])
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <UpdateItemDialog
          open={openUpdateDialog}
          handleClose={() => setOpenUpdateDialog(false)}
          config={config}
          api={api}
          idName={displayConfig.idName}
          data={selectedItem}
        />
      </TableContainer>
    </Box>
  );
}
