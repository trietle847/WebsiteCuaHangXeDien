import type { EntityConfig } from "../types";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { productFormConfig } from "../../../components/form/formConfig";

export const ProductEntity: EntityConfig = {
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
      width: 250,
    },
    {
      field: "price",
      headerName: "Giá",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return <span>{params.value} VNĐ</span>;
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <button onClick={() => onEdit(params.row.id)}>Sửa</button>
            <button onClick={() => onDelete(params.row.id)}>Xóa</button>
          </>
        );
      },
    },
  ],
  formConfig: productFormConfig,
};
