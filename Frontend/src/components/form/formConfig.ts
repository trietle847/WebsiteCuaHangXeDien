import {text} from "../inputs/inputConfig";
import apiClient from "../../services/axios";
import productApi from "../../services/product.api";

const attr = (key: string, label: string, required = false, input = text()) => ({
  key,
  label,
  required,
  input,
});

export const defineConfig = (
  objectName: string,
  objectLabel: string,
  api: apiClient,
  attributes: ReturnType<typeof attr>[]
) => {
  const config =  attributes.map((attr) => ({
    ...attr,
    propname: `${objectName}_${attr.key}`,
  }));
  return {
    name: objectName,
    label: objectLabel,
    api,
    config
  }
};

const product = [
  attr("name", "Tên sản phẩm", true, text()),
  attr("price", "Giá", true, text("number")),
  attr("stock_quantity", "Số lượng",true, text("number")),
  attr("specifications", "Thông số",true, text()),
  attr("average_rating", "Đánh giá", false, text("number")),
];

export const productFormConfig = defineConfig("products", "Sản phẩm", productApi, product);
