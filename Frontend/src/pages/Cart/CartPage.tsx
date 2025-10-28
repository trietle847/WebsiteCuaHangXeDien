import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import cartApi from "../../services/cart.api";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:3000";

  // 🔹 Lấy giỏ hàng khi load trang
  const fetchCart = async () => {
    try {
      const response = await cartApi.getAll();
      setCart(response.data);
    } catch (e) {
      console.log("❌ Lỗi lấy giỏ hàng:", e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (cartItemId: number, delta: number) => {
    if (!cart || loading) return;
    const item = cart.Items.find((i) => i.cartItem_id === cartItemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    if (newQuantity === item.quantity) return;

    setLoading(true);
    try {
      await cartApi.update(cartItemId, { quantity: newQuantity });
      const updatedItems = cart.Items.map((i) =>
        i.cartItem_id === cartItemId ? { ...i, quantity: newQuantity } : i
      );
      setCart({ ...cart, Items: updatedItems });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = async (cartItemId: number) => {
    if (!cart) return;
    if (!confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?")) return;

    setLoading(true);
    try {
      await cartApi.delete(cartItemId);
      setCart({
        ...cart,
        Items: cart.Items.filter((item) => item.cartItem_id !== cartItemId),
      });
    } catch (e) {
      console.log("❌ Lỗi khi xóa sản phẩm:", e);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Tính tổng tiền
  const totalPrice = cart
    ? cart.Items.reduce(
        (sum, item) => sum + item.ProductColor.Product.price * item.quantity,
        0
      )
    : 0;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 5 }}>
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          backgroundColor: "#fff",
          borderRadius: 2,
          px: 3,
          py: 4,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          🛒 Giỏ hàng của bạn
        </Typography>

        {!cart ? (
          <Typography align="center" sx={{ mt: 4 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Đang tải giỏ hàng...
          </Typography>
        ) : cart.Items.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            Giỏ hàng trống. Hãy thêm sản phẩm nhé! 🛍️
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {/* 🔹 Bảng sản phẩm */}
            <Box sx={{ flex: 3, minWidth: 700 }}>
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, boxShadow: "none" }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Hình ảnh
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tên sản phẩm
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Màu sắc</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Số lượng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Giá tiền
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cart.Items.map((item) => (
                      <TableRow
                        key={item.cartItem_id}
                        hover
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "#fafafa",
                          },
                        }}
                      >
                        <TableCell>
                          <img
                            src={
                              item.ProductColor.ColorImages.length > 0
                                ? `${BASE_URL}${item.ProductColor.ColorImages[0].url}`
                                : "/placeholder.png"
                            }
                            alt={item.ProductColor.Product.name}
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">
                            {item.ProductColor.Product.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              backgroundColor: item.ProductColor.Color.code,
                              margin: "0 auto",
                              border: "1px solid #ccc",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton
                              disabled={loading}
                              onClick={() =>
                                handleQuantityChange(item.cartItem_id, -1)
                              }
                              size="small"
                            >
                              <Remove />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              size="small"
                              inputProps={{
                                readOnly: true,
                                style: { textAlign: "center", width: 40 },
                              }}
                            />
                            <IconButton
                              disabled={loading}
                              onClick={() =>
                                handleQuantityChange(item.cartItem_id, 1)
                              }
                              size="small"
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {(
                            item.ProductColor.Product.price * item.quantity
                          ).toLocaleString()}{" "}
                          ₫
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleRemove(item.cartItem_id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* 🔹 Tổng tiền */}
            <Box
              sx={{
                flex: 1,
                minWidth: 300,
                p: 3,
                borderRadius: 3,
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                height: "fit-content",
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tổng thanh toán
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Tổng tiền hàng: <strong>{totalPrice.toLocaleString()} ₫</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Phí vận chuyển: <strong>30.000 ₫</strong>
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary">
                Tổng cộng: {(totalPrice + 30000).toLocaleString()} ₫
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
              >
                Tiến hành thanh toán
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
