import { text } from "../inputs/inputConfig";
import apiClient from "../../services/axios";
import productApi from "../../services/product.api";
import type { InputProps, ValidationRules } from "../inputs/inputConfig";
import { textValidation } from "../inputs/inputConfig";

const attr = (
  key: string,
  label: string,
  input: InputProps = text(),
  validation?: ValidationRules
) => ({
  key,
  label,
  input,
  validation,
});

export const defineConfig = (
  objectName: string,
  objectLabel: string,
  attributes: ReturnType<typeof attr>[],
  api?: apiClient
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
    required: "Tên sản phẩm là bắt buộc",
    ...textValidation.name(3, 100),
  }),
  attr("price", "Giá", text("number"), {
    required: "Giá là bắt buộc",
    ...textValidation.number(0),
  }),
  attr("stock_quantity", "Số lượng", text("number"), {
    required: "Số lượng là bắt buộc",
    ...textValidation.number(0),
  }),
  attr("specifications", "Thông số", text(), {
    required: "Thông số là bắt buộc",
    ...textValidation.length(0, 500),
  }),
  attr("average_rating", "Đánh giá", text("number"), {
    ...textValidation.number(0, 5),
  }),
];

export const productFormConfig = defineConfig(
  "products",
  "Sản phẩm",
  product,
  productApi
);
