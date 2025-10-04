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

export const createTable = (idName: string, columns: ReturnType<typeof col>[]) => ({
  idName,
  columns,
});

export const productTable = createTable("product_id", product);