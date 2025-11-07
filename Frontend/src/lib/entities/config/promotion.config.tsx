import type { EntityConfig } from "./types";
import promotionApi from "../../../services/promotion.api";
import { promotionFormConfig } from "../form/promotion.form";
import { Box, Tooltip, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { NumericFormat } from "react-number-format";

export const promotionConfig: EntityConfig = {
  name: "promotions",
  idKey: "promotion_id",
  label: "Khuyến mãi",
  permission: {
    create: true,
    update: true,
    delete: true,
  },
  getColumns: ({ onEdit, onDelete } = {}) => [
    {
      field: "name",
      headerName: "Tên khuyến mãi",
      flex: 1,
    },
    {
      field: "code",
      headerName: "Mã khuyến mãi",
      flex: 1,
    },
    {
      field: "content",
      headerName: "Nội dung",
      flex: 1,
    },
    {
      field: "discount_value",
      headerName: "Giá trị giảm",
      flex: 1,
      renderCell: (params) => {
        if (params.row.discount_type === "fixed_amount") {
          return (
            <NumericFormat
              value={params.row.discount_value}
              displayType="text"
              thousandSeparator
              suffix=" đ"
            />
          );
        }
        return `${params.row.discount_value} %`;
      },
    },
    {
      field: "minimum_order_value",
      headerName: "Giá trị đơn hàng tối thiểu",
      flex: 1,
      renderCell: (params) => {
        return params.value ? (
          <NumericFormat
            value={params.value}
            displayType="text"
            thousandSeparator
            suffix=" đ"
          />
        ) : (
          "Không giới hạn"
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <Box>
          {onEdit && (
            <Tooltip title="Chỉnh sửa">
              <IconButton
                sx={{
                  "&:hover": {
                    color: "blue",
                  },
                }}
                onClick={() => onEdit(params.row)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Xóa">
              <IconButton
                sx={{
                  "&:hover": {
                    color: "red",
                  },
                }}
                onClick={() => onDelete(params.row)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ],
  api: promotionApi,
  customFormComponents: null,
  formConfig: promotionFormConfig,
};
