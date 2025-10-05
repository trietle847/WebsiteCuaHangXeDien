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
import AddItemDialog from "../../components/AddItemDialog";
import UpdateItemDialog from "../../components/UpdateItemDialog";
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
      {/*Lỗi tạm thời do định nghĩa kiểu trả về của API bị sai nhưng vẫn hoạt động*/}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              {displayConfig.columns.map((col: any) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data[displayConfig.tableKey].map((item: any) => (
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
