import type { EntityConfig } from "./types";
import type { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { actionColumn } from "./commonColumn";
import productApi from "../../../services/product.api";
import { NumericFormat } from "react-number-format";
import ProductForm from "../../../components/form/Product/ProductForm";
import { Visibility } from "@mui/icons-material";
import { Box, Tooltip, IconButton } from "@mui/material";
import Gallery from "../../../components/ImageGallery/Gallery";
import type { ProductColor } from "../../types";

const specFields = [
  {
    name: "length",
    label: "Chiều dài",
    unit: "mm",
  },
  {
    name: "width",
    label: "Chiều rộng",
    unit: "mm",
  },
  {
    name: "height",
    label: "Chiều cao",
    unit: "mm",
  },
  {
    name: "saddle_height",
    label: "Chiều cao yên",
    unit: "mm",
  },
  {
    name: "maximum_speed",
    label: "Tốc độ tối đa",
    unit: "km/h",
  },
  // { name: "weight", label: "Trọng lượng", unit: "kg" },
  {
    name: "battery",
    label: "Dung lượng pin",
    unit: "Ah",
  },
  { name: "vehicle_engine", label: "Động cơ", unit: "" },
  {
    name: "charging_time",
    label: "Thời gian sạc",
    unit: "giờ",
  },
  {
    name: "maximum_load",
    label: "Tải trọng tối đa",
    unit: "kg",
  },
];

export const productConfig: EntityConfig = {
  idKey: "product_id",
  searchKey: "name",
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
          return (
            <span>
              <NumericFormat
                value={params.row.price}
                displayType={"text"}
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            </span>
          );
        },
      },
      {
        field: "description",
        headerName: "Mô tả",
        flex: 1,
      },
      {
        field: "ProductDetail",
        headerName: "Thông số kỹ thuật",
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const details = params.row.ProductDetail;
          if (!details) return "Chưa thiết lập";
          return (
            <Tooltip title={"Xem chi tiết"}>
              <IconButton
                sx={{
                  "&:hover": {
                    color: "green",
                  },
                }}
                onClick={() => {
                  if (actions?.onView) {
                    actions.onView({
                      title: "Thông số kỹ thuật",
                      content: (
                        <Box>
                          {specFields.map((field) => (
                            <Box key={field.name} sx={{ mb: 1 }}>
                              <strong>{field.label}:</strong>{" "}
                              {details[field.name]
                                ? `${details[field.name]} ${field.unit}`
                                : "Chưa thiết lập"}
                            </Box>
                          ))}
                        </Box>
                      ),
                    });
                  }
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          );
        },
      },
      {
        field: "ProductColors",
        headerName: "Màu sắc",
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const colors: ProductColor[] = params.row.ProductColors;
          if (!colors || colors.length === 0) return "Chưa có màu";
          return (
            <Tooltip title={"Xem chi tiết"}>
              <IconButton
                sx={{
                  "&:hover": {
                    color: "green",
                  },
                }}
                onClick={() => {
                  if (actions?.onView) {
                    actions.onView({
                      title: "Màu sắc sản phẩm",
                      content: (
                        <Box>
                          {colors.map((pc) => (
                            <Box
                              key={pc.productColor_id}
                              sx={{
                                mb: 2,
                                p: 1,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                              }}
                            >
                              <strong>{pc.Color.name}</strong>
                              <div>Số lượng: {pc.stock_quantity}</div>
                              <Gallery
                                items={pc.ColorImages}
                                urlKey="url"
                                idKey="image_id"
                              />
                            </Box>
                          ))}
                        </Box>
                      ),
                    });
                  }
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          );
        },
      },
      {
        field: "Company.name",
        headerName: "Nhà sản xuất",
        flex: 1,
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
