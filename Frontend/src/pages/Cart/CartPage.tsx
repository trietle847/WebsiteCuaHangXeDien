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
  useMediaQuery,
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
import FormatNumber from "../../helpper/FormatNumber";

export default function CartPage() {
  const { cart, loading, errorMsg, updateQuantity, removeItem, totalPrice } =
    useCart();
  const BASE_URL = "http://localhost:3000";
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 1000px)");

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
    for (const item of cart.Items) {
      if (item.quantity > item.ProductColor.stock_quantity) {
        alert(`Sản phẩm "${item.ProductColor.Product.name}" vượt quá tồn kho!`);
        return false;
      }
    }

    dispatch(addCheckoutItem(formattedItems));
    navigate("/checkout");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 4 }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          backgroundColor: "#fff",
          borderRadius: 2,
          p: { xs: 2, md: 4 },
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: { xs: "20px", md: "24px" },
          }}
        >
          Giỏ hàng của bạn
        </Typography>

        {/* Loading */}
        {!cart ? (
          <Typography align="center" sx={{ mt: 4 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} /> Đang tải giỏ hàng...
          </Typography>
        ) : cart.Items.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            Giỏ hàng trống. Hãy thêm sản phẩm nhé!
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              gap: 3,
            }}
          >
            {/* ---------- TABLE DESKTOP ---------- */}
            {!isMobile && (
              <Box sx={{ flex: 3 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Hình ảnh
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Tên sản phẩm
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Màu sắc
                        </TableCell>
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
                        <TableRow key={item.cartItem_id} hover>
                          <TableCell>
                            <img
                              src={
                                item.ProductColor.ColorImages?.[0]
                                  ? BASE_URL +
                                    item.ProductColor.ColorImages[0].url
                                  : "/placeholder.png"
                              }
                              alt={item.ProductColor.Product.name}
                              style={{
                                width: 70,
                                height: 70,
                                borderRadius: 8,
                                cursor: "pointer",
                                objectFit: "cover",
                              }}
                              onClick={() =>
                                navigate(
                                  `/products/${item.ProductColor.Product.product_id}`
                                )
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {item.ProductColor.Product.name}
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                backgroundColor: item.ProductColor.Color.code,
                                border: "1px solid #ccc",
                              }}
                            />
                          </TableCell>

                          <TableCell>
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
                          </TableCell>

                          <TableCell sx={{ fontWeight: "bold" }}>
                            {FormatNumber(
                              item.ProductColor.Product.price * item.quantity
                            )}{" "}
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
            )}

            {/* ---------- MOBILE CARD VIEW ---------- */}
            {isMobile && (
              <Box sx={{ flex: 1 }}>
                {cart.Items.map((item) => (
                  <Box
                    key={item.cartItem_id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      border: "1px solid #eee",
                      background: "#fff",
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <img
                      src={
                        item.ProductColor.ColorImages?.[0]
                          ? BASE_URL + item.ProductColor.ColorImages[0].url
                          : "/placeholder.png"
                      }
                      alt={item.ProductColor.Product.name}
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold" fontSize={15}>
                        {item.ProductColor.Product.name}
                      </Typography>

                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: item.ProductColor.Color.code,
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                          mt: 1,
                        }}
                      />

                      <Typography fontWeight="bold" mt={1}>
                        {FormatNumber(
                          item.ProductColor.Product.price * item.quantity
                        )}
                        ₫
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <IconButton
                          size="small"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.cartItem_id, -1)}
                        >
                          <Remove fontSize="small" />
                        </IconButton>

                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>

                        <IconButton
                          size="small"
                          disabled={
                            item.quantity >= item.ProductColor.stock_quantity
                          }
                          onClick={() => updateQuantity(item.cartItem_id, 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>

                      <IconButton
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={() => removeItem(item.cartItem_id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* ---------- SIDEBAR TỔNG TIỀN ---------- */}
            <Box
              sx={{
                flex: isTablet ? 1 : 0.7,
                minWidth: isTablet ? "100%" : 300,
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

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                Tổng cộng: {FormatNumber(totalPrice)} ₫
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={handleProductFromCart}
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
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
