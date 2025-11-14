import React from "react";
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
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useCart } from "../../context/CartContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import {
  addCheckoutItem,
  clearCheckoutItems,
} from "../../redux/slices/checkoutSlice";

export default function CartPage() {
  const { cart, loading, errorMsg, updateQuantity, removeItem, totalPrice } =
    useCart();
  const BASE_URL = "http://localhost:3000";
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = sessionStorage.getItem("token");
  if (!userInfo && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleProductFromCart = () => {
    if (!cart?.Items?.length) return;
    dispatch(clearCheckoutItems());
    const formattedItems = cart.Items.map((item) => {
      const pc = item.ProductColor;
      return {
        productColorId: pc.productColor_id,
        name: pc.Product.name,
        price: pc.Product.price,
        colorName: pc.Color.name,
        colorCode: pc.Color.code,
        image: pc.ColorImages?.[0]?.url || "",
        quantity: item.quantity,
        quantityMax: pc.stock_quantity,
      };
    });

    dispatch(addCheckoutItem(formattedItems));

    // // Điều hướng đến trang Checkout
    navigate("/checkout");
  };

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
            <CircularProgress size={24} sx={{ mr: 1 }} /> Đang tải giỏ hàng...
          </Typography>
        ) : cart.Items.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            Giỏ hàng trống. Hãy thêm sản phẩm nhé! 🛍️
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {/* Bảng sản phẩm */}
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
                          "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        }}
                      >
                        <TableCell>
                          <img
                            src={
                              item.ProductColor?.ColorImages.length > 0
                                ? `${BASE_URL}${item.ProductColor.ColorImages[0].url}`
                                : "/placeholder.png"
                            }
                            alt={item.ProductColor.Product.name}
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate(
                                `/products/${item.ProductColor.Product.product_id}`
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>{item.ProductColor.Product.name}</TableCell>
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
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <IconButton
                                disabled={loading || item.quantity <= 1}
                                onClick={() =>
                                  updateQuantity(item.cartItem_id, -1)
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
                                disabled={
                                  loading ||
                                  item.quantity >=
                                    item.ProductColor.stock_quantity
                                }
                                onClick={() =>
                                  updateQuantity(item.cartItem_id, 1)
                                }
                                size="small"
                              >
                                <Add />
                              </IconButton>
                            </Box>
                            {errorMsg[item.cartItem_id] && (
                              <Typography variant="caption" color="error">
                                {errorMsg[item.cartItem_id]}
                              </Typography>
                            )}
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
                            onClick={() => removeItem(item.cartItem_id)}
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

            {/* Tổng tiền */}
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
                Phí vận chuyển: <strong>20.000 ₫</strong>
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary">
                Tổng cộng: {(totalPrice + 20000).toLocaleString()} ₫
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleProductFromCart}
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
