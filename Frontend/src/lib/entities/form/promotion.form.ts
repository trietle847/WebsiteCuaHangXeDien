import promotionApi from "../../../services/promotion.api";
import { attr, defineConfig } from "./formConfig";
import {
  text,
  currency,
  textarea,
  datePicker,
  select,
  option,
  textValidation,
  dynamicDiscountValue,
} from "./inputConfig";

const promotion = [
  attr("name", "Tên khuyến mãi", text(), {
    required: true,
    validation: textValidation.length(1, 100),
  }),
  attr("code", "Mã khuyến mãi", text(), {
    required: true,
    validation: textValidation.length(5, 20),
  }),
  attr("start_date", "Ngày bắt đầu", datePicker(), {
    required: true,
  }),
  attr("end_date", "Ngày kết thúc", datePicker(), {
    required: true,
  }),
  attr(
    "discount_type",
    "Loại giảm giá",
    select([
      option("fixed_amount", "Giảm theo số tiền"),
      option("percentage", "Giảm theo phần trăm"),
    ]),
    {
      required: true,
    }
  ),
  attr("discount_value", "Giá trị giảm", dynamicDiscountValue(), {
    required: true,
    validation: {
      validate: (value: any, formValues: any) => {
        const discountType = formValues.discount_type;
        const numValue = Number(value);

        if (!value) return "Giá trị giảm là bắt buộc";
        if (isNaN(numValue)) return "Giá trị phải là số";

        // Validate theo discount_type
        if (discountType === "percentage") {
          if (numValue < 1 || numValue > 100) {
            return "Tỷ lệ giảm giá phải từ 1% đến 100%";
          }
        } else if (discountType === "fixed_amount") {
          if (numValue < 1000) {
            return "Số tiền giảm tối thiểu là 1.000 đ";
          }
        }

        return true;
      },
    },
  }),
  attr("minimum_order_value", "Giá trị đơn hàng tối thiểu", currency(), {
    required: false,
    validation: textValidation.currency({ min: 0 }),
  }),
  attr("max_discount_amount", "Giá trị giảm tối đa", currency(), {
    required: false,
    validation: textValidation.currency({ min: 0 }),
    dependsOn: {
      field: "discount_type",
      value: "percentage",
    },
  }),
  attr("content", "Nội dung", textarea(), {
    required: false,
    validation: textValidation.length(1, 500),
  }),
];

export const promotionFormConfig = defineConfig(
  "promotions",
  "Khuyến mãi",
  promotionApi,
  promotion
);
