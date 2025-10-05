import {
  defineConfig,
  productFormConfig,
} from "../../components/form/formConfig";

const col = (key: string, label: string) => ({
  key,
  label,
});

export const product = [
  col("name", "Tên sản phẩm"),
  col("price", "Giá"),
  col("stock_quantity", "Số lượng"),
  col("specifications", "Thông số kỹ thuật"),
];

export const createTable = (
  idName: string,
  tableKey: string,
  columns: ReturnType<typeof col>[],
  formConfig: ReturnType<typeof defineConfig>,
  creatable: boolean
) => ({
  idName,
  tableKey,
  columns,
  creatable,
  formConfig,
});

export const productTable = createTable(
  "product_id",
  "products",
  product,
  productFormConfig,
  true
);
