import { text, uploadFile } from "../inputs/inputConfig";
import apiClient from "../../services/axios";
import productApi from "../../services/product.api";
import type { InputProps, ValidationRules } from "../inputs/inputConfig";
import { textValidation } from "../inputs/inputConfig";

const attr = (
  key: string,
  label: string,
  input: InputProps = text(),
  required?: boolean,
  rules?: ValidationRules
) => {
  const validation: ValidationRules = { ...(rules || {}) };

  // Nếu required = true, tự động thêm message "label + là bắt buộc"
  if (required) {
    validation.required = `${label} là bắt buộc`;
  }

  return {
    key,
    label,
    input,
    validation,
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
  attr("name", "Tên sản phẩm", text(), true, textValidation.name(3, 100)),
  attr("price", "Giá", text("number"), true, textValidation.number(0)),
  attr(
    "stock_quantity",
    "Số lượng",
    text("number"),
    true,
    textValidation.number(0)
  ),
  attr(
    "specifications",
    "Thông số",
    text(),
    true,
    textValidation.length(0, 500)
  ),
  attr(
    "average_rating",
    "Đánh giá",
    text("number"),
    false,
    textValidation.number(0, 5, "float")
  ),
  attr("images", "Hình ảnh", uploadFile(true, 3, 80, 10), true),
];

export const productFormConfig = defineConfig(
  "products",
  "Sản phẩm",
  product,
  productApi
);
