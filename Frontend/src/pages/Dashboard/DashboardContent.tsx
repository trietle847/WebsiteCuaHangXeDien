import {
  Box,
  Button,
} from "@mui/material";
import AddItemDialog from "../../components/AddItemDialog";
import { useState } from "react";
import { productFormConfig } from "../../components/form/formConfig";
import ProductApi from "../../services/product.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import DataTable from "./DataTable";
import { productTable } from "./displayConfig";
export default function DashboardContent() {
  const [openDialog, setOpenDialog] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: [productFormConfig.name],
    queryFn: () => ProductApi.getAll(),
  });
  return (
    <Box width={"100%"}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Thêm sản phẩm
        </Button>
        <AddItemDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          config={productFormConfig}
          api={ProductApi}
        />
      </Box>
      {/*Lỗi tạm thời do định nghĩa kiểu trả về của API bị sai nhưng vẫn hoạt động*/}
      <DataTable api={ProductApi} data={data?.data} displayConfig={productTable} updateConfig={productFormConfig} />
    </Box>
  );
}
