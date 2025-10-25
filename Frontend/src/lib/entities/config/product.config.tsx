import type { EntityConfig } from "../types";
import type { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { actionColumn } from "./commonColumn";
import productApi from "../../../services/product.api";
import ProductForm from "../../../components/form/ProductForm";
import { NumericFormat } from "react-number-format";

export const ProductEntity: EntityConfig = {
  idKey: "product_id",
  name: "products",
  label: "Sản phẩm",
  permission: {
    create: true,
    update: true,
    delete: true,
  },
  getColumns: (actions) => {
    const baseColumns: GridColDef[] = [
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
          return <span>
            <NumericFormat
              value={params.row.price}
              displayType={"text"}
              thousandSeparator="."
              decimalSeparator=","
              suffix=" đ"
            />
          </span>;
        },
      },
      // {
      //   field: "total_quantity",
      //   headerName: "Tổng số lượng tồn kho",
      //   flex: 1,
      // },
      {
        field: "description",
        headerName: "Mô tả",
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
    ];

    if (actions?.onEdit || actions?.onDelete) {
      baseColumns.push(
        actionColumn({
          onEdit: actions.onEdit,
          onDelete: actions.onDelete,
          permission: {
            update: true,
            delete: true,
          },
        })
      );
    }

    return baseColumns;
  },
  api: productApi,
  customFormComponents: (data) => <ProductForm data={data} />,
};
