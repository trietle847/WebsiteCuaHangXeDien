import {
  Box,
  Button,
  Chip,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Autocomplete from "../../inputs/Autocomplete";
import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import productApi from "../../../services/product.api";
import type { Product, ProductColor } from "../../../lib/types";
import { NumericFormat } from "react-number-format";
import type { OrderItem } from "../../../lib/types";
import { ToastContainer, toast } from "react-toastify";

export default function ProductSelection() {
  const { control, setValue, getValues } = useFormContext<{
    items: OrderItem[];
  }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductColor, setSelectedProductColor] =
    useState<ProductColor | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<number | "">(1);

  const { fields, append } = useFieldArray<{ items: OrderItem[] }>({
    control,
    name: "items",
  });

  const handleAddItem = () => {
    if (!selectedProduct || !selectedProductColor || quantityToAdd === "") {
      return;
    }
    if (quantityToAdd <= 0) {
      toast.error("Số lượng sản phẩm không hợp lệ")
      return;
    }
    if (quantityToAdd > selectedProductColor.stock_quantity) {
      toast.error("Số lượng được thêm vượt quá số lượng tồn kho")
      return;
    }
    // Kiểm tra xem mục đã tồn tại trong danh sách chưa
    const existingIndex = fields.findIndex(
      (item) => item.productColor_id === selectedProductColor.productColor_id
    );

    if (existingIndex !== -1) {
      // Nếu đã tồn tại, lấy số lượng hiện tại từ form (không phải từ fields)
      const currentQuantity = getValues(`items.${existingIndex}.quantity`);

      if (typeof currentQuantity !== "number") {
        return;
      }

      const newQuantity = currentQuantity + quantityToAdd;

      if (newQuantity > selectedProductColor.stock_quantity) {
        alert(
          `Số lượng tồn kho không đủ (chỉ còn ${selectedProductColor.stock_quantity}).`
        );
        return;
      }

      // Cập nhật cả quantity và totalPrice
      setValue(`items.${existingIndex}.quantity`, newQuantity);
      setValue(
        `items.${existingIndex}.totalPrice`,
        newQuantity * fields[existingIndex].price
      );
    } else {
      // Nếu chưa tồn tại, thêm mới
      append({
        productColor_id: selectedProductColor.productColor_id,
        productName: selectedProduct.name,
        colorName: selectedProductColor.Color.name,
        colorCode: selectedProductColor.Color.code,
        stock_quantity: selectedProductColor.stock_quantity,
        quantity: quantityToAdd,
        price: selectedProduct.price,
        totalPrice: selectedProduct.price * quantityToAdd,
      });
    }

    // Reset các ô nhập
    setSelectedProductColor(null);
    setQuantityToAdd(1);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ToastContainer />
      <Autocomplete
        value={selectedProduct}
        api={productApi}
        idKey="product_id"
        optionLabelKey={["name"]}
        label="Chọn sản phẩm"
        placeholder="Nhập tên sản phẩm..."
        objectName="product"
        onChange={(product) => {
          setSelectedProduct(product);
          setSelectedProductColor(product?.ProductColors[0] || null);
        }}
      />
      {selectedProduct && (
        <Box sx={{ border: "1px solid grey", borderRadius: 2, p: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h5">{selectedProduct.name}</Typography>
            <Typography variant="h6" color="primary">
              <NumericFormat
                value={selectedProduct.price}
                displayType={"text"}
                thousandSeparator="."
                decimalSeparator=","
                suffix={" đ"}
              />
            </Typography>
            {selectedProduct.ProductColors.map((pc) => (
              <Tooltip
                title={`Chọn màu ${pc.Color.name.toLowerCase()}`}
                key={pc.productColor_id}
              >
                <Button
                  variant={
                    selectedProductColor?.productColor_id === pc.productColor_id
                      ? "contained"
                      : "outlined"
                  }
                  sx={{
                    minWidth: 0,
                    width: 36,
                    height: 36,
                    borderRadius: "25px",
                    backgroundColor: pc.Color.code,
                    border:
                      selectedProductColor?.productColor_id ===
                      pc.productColor_id
                        ? "2px solid #000"
                        : "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)", // thêm shadow box
                    "&:hover": {
                      backgroundColor: pc.Color.code, // giữ nguyên màu khi hover
                      opacity: 0.5,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.20)", // shadow mạnh hơn khi hover
                    },
                  }}
                  onClick={() => setSelectedProductColor(pc)}
                />
              </Tooltip>
            ))}
          </Box>
          {selectedProductColor && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Màu {selectedProductColor.Color.name.toLowerCase()} - tồn kho:{" "}
                {selectedProductColor.stock_quantity}
              </Typography>
              {fields.some(
                (item) =>
                  item.productColor_id === selectedProductColor.productColor_id
              ) && <Chip label="Đã thêm vào danh sách" color="success" />}
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TextField
                  label="Số lượng đặt"
                  type="number"
                  value={quantityToAdd}
                  onChange={(e) =>
                    setQuantityToAdd(parseInt(e.target.value) || "")
                  }
                  fullWidth
                  sx={{ mr: 1, maxWidth: 600 }}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddItem}
                >
                  {fields.some(
                    (item) =>
                      item.productColor_id ===
                      selectedProductColor.productColor_id
                  )
                    ? "Cộng dồn vào đơn hàng"
                    : "Thêm vào đơn hàng"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
