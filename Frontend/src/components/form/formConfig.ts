import { text } from "../inputs/inputConfig";
import apiClient from "../../services/axios";
import productApi from "../../services/product.api";
import type { InputProps, ValidationRules } from "../inputs/inputConfig";
import { textValidation } from "../inputs/inputConfig";

const attr = (
  key: string,
  label: string,
  input: InputProps = text(),
  options?: {
    validation?: ValidationRules;
    required?: boolean; // true/false để tự động tạo message
  }
) => {
  const validation: ValidationRules = { ...(options?.validation || {}) };

  // Nếu required = true, tự động thêm message "label + là bắt buộc"
  if (options?.required) {
    validation.required = `${label} là bắt buộc`;
  }

  return {
    key,
    label,
    input,
    validation,
    required: options?.required
  };
};

export const defineConfig = (
  objectName: string,
  objectLabel: string,
  attributes: ReturnType<typeof attr>[],
  api: apiClient
) => {
  const config = attributes.map((attr) => ({
    ...attr,
    propname: `${objectName}_${attr.key}`,
  }));
  return {
    name: objectName,
    label: objectLabel,
    config,
    api,
  };
};
// This duplicate function should be removed

const product = [
  attr("name", "Tên sản phẩm", text(), {
    required: true,
    validation: textValidation.name(3, 100),
  }),
  attr("price", "Giá", text("number"), {
    required: true,
    validation: textValidation.number(0),
  }),
  attr("stock_quantity", "Số lượng", text("number"), {
    required: true,
    validation: textValidation.number(0),
  }),
  attr("specifications", "Thông số", text(), {
    required: true,
    validation: textValidation.length(0, 500),
  }),
  attr("average_rating", "Đánh giá", text("number"), {
    validation: textValidation.number(0, 5, "float"),
  }),
];

export const productFormConfig = defineConfig(
  "products",
  "Sản phẩm",
  product,
  productApi
);
