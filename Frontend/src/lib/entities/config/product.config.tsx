import type { EntityConfig } from "../types";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { actionColumn } from "./commonColumn";
import productApi from "../../../services/product.api";
import ProductForm from "../../../components/form/ProductForm";

export const ProductEntity: EntityConfig = {
  idKey: "product_id",
  name: "products",
  label: "Sản phẩm",
  permission: {
    create: true,
    update: true,
    delete: true,
  },
  getColumns: ({ onEdit, onDelete }) => [
    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Giá",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return <span>{params.value} VNĐ</span>;
      },
    },
    {
      field: "stock_quantity",
      headerName: "Số lượng tồn kho",
      flex: 1,
    },
    {
      field: "Company.name",
      headerName: "Nhà sản xuất",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.Company?.name || "N/A";
      },
    },
    actionColumn({
      onEdit,
      onDelete,
      permission: {
        update: true,
        delete: true,
      },
    }),
  ],
  api: productApi,
  customFormComponents: <ProductForm />,
};
