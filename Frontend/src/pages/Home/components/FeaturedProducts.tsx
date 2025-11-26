import {
  Typography,
  Grid,
  Card,
  Button,
  Box,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import SpeedIcon from "@mui/icons-material/Speed";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import FormatNumber from "../../../helpper/FormatNumber";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function FeaturedProducts({
  products = [],
  promotions = [],
}: {
  products: any[];
  promotions?: any[];
}) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [selectedColors, setSelectedColors] = useState<Record<number, number>>(
    {}
  );
  const [hovered, setHovered] = useState<number | null>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  // ===============================
  // 🔥 Tính giảm giá cho sản phẩm
  // ===============================
  const calculatePromotion = (product) => {
    if (!promotions || promotions.length === 0)
      return {
        ...product,
        bestPromotion: null,
        discountedPrice: product.price,
        discountValue: 0,
      };

    let bestPromo = null;
    let bestDiscount = 0;

    promotions.forEach((promo) => {
      let discountValue = 0;

      if (promo.discount_type === "fixed_amount") {
        discountValue = promo.discount_value;
      } else if (promo.discount_type === "percentage") {
        discountValue = (product.price * promo.discount_value) / 100;
      }

      if (discountValue > bestDiscount) {
        bestDiscount = discountValue;
        bestPromo = promo;
      }
    });

    return {
      ...product,
      bestPromotion: bestPromo,
      discountedPrice: Math.max(product.price - bestDiscount, 0),
      discountValue: bestDiscount,
    };
  };

  // Áp dụng giảm giá
  const displayProducts = products
    .slice(0, 8)
    .map((p) => calculatePromotion(p));

  // ======================================
  // 🛒 Xử lý thêm vào giỏ
  // ======================================
  const handleAddToCart = async (productColorId: number) => {
    try {
      if (userInfo) {
        await addItem(productColorId, 1);
        toast.success("Thêm vào giỏ hàng thành công!", { autoClose: 3000 });
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <Box sx={{ mt: 2, px: { xs: 2, md: 6 } }}>

      <Grid container spacing={5} justifyContent={"center"}>
        {displayProducts.map((item) => {
          const productColors = item.ProductColors || [];
          const activeColorIndex = selectedColors[item.product_id] ?? 0;
          const activeColor = productColors[activeColorIndex];
          const colorImgs = activeColor?.ColorImages || [];

          const img1 = colorImgs[0]
            ? `http://localhost:3000${colorImgs[0].url}`
            : "/no-image.png";

          const img2 = colorImgs[1]
            ? `http://localhost:3000${colorImgs[1].url}`
            : img1;

          const isHovered = hovered === item.product_id;

          return (
            <Grid
              item
              xs={6}
              sm={6}
              md={3}
              lg={3}
              key={item.product_id}
              sx={{ display: "flex" }}
            >
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  width: "100%",
                  transition: "all .35s ease",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                  bgcolor: "#fff",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                  },
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={() => setHovered(item.product_id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Badge giảm giá */}
                {item.bestPromotion && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      px: 1.6,
                      py: 0.6,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      bgcolor: "error.main",
                      color: "#fff",
                      borderRadius: "10px",
                      zIndex: 5,
                    }}
                  >
                    -{FormatNumber(item.bestPromotion.discount_value)}
                    {item.bestPromotion.discount_type === "fixed_amount"
                      ? " ₫"
                      : " %"}
                  </Box>
                )}

                {/* Ảnh */}
                <Box sx={{ width: "100%", height: 210, position: "relative" }}>
                  <Box
                    component="img"
                    src={img1}
                    alt={item.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      position: "absolute",
                      p: 2,
                      transition: "opacity .6s",
                      opacity: isHovered ? 0 : 1,
                    }}
                  />
                  <Box
                    component="img"
                    src={img2}
                    alt="ảnh phụ"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      position: "absolute",
                      p: 2,
                      transition: "opacity .6s",
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                </Box>

                {/* Tên */}
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.05rem",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#222",
                    px: 2,
                    mt: 1.2,
                    minHeight: 55,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.name}
                </Typography>

                {/* Dưới tên */}
                <Box display="flex" sx={{ px: 2, mt: 0.5, flex: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    {/* Giá */}
                    {item.bestPromotion ? (
                      <>
                        <Typography
                          sx={{
                            color: "#9e9e9e",
                            fontSize: ".9rem",
                            textDecoration: "line-through",
                          }}
                        >
                          {FormatNumber(item.price)} ₫
                        </Typography>
                        <Typography
                          sx={{
                            color: "#d32f2f",
                            fontWeight: 700,
                            fontSize: "1.25rem",
                          }}
                        >
                          {FormatNumber(item.discountedPrice)} ₫
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        sx={{
                          color: "#d32f2f",
                          fontWeight: 700,
                          fontSize: "1.25rem",
                        }}
                      >
                        {FormatNumber(item.price)} ₫
                      </Typography>
                    )}

                    {/* Hãng */}
                    <Typography
                      sx={{ color: "#444", fontSize: "0.9rem", mt: 1 }}
                    >
                      Hãng: <b>{item.Company?.name || "Đang cập nhật"}</b>
                    </Typography>

                    {/* Màu */}
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      {productColors.map((pc, index) => (
                        <Tooltip key={pc.color_id} title={pc.Color.name}>
                          <Box
                            onClick={() =>
                              setSelectedColors((prev) => ({
                                ...prev,
                                [item.product_id]: index,
                              }))
                            }
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              bgcolor: pc.Color.code,
                              border:
                                index === activeColorIndex
                                  ? "2px solid #1976d2"
                                  : "1px solid #ccc",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  {/* Thông số */}
                  {!isMobile && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        bgcolor: "#f8f9fc",
                        borderRadius: 2,
                        p: 1.5,
                        gap: 0.7,
                        minWidth: 110,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.7,
                        }}
                      >
                        <BatteryChargingFullIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">
                          {item.ProductDetail?.charging_time}h
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.7,
                        }}
                      >
                        <SpeedIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">
                          {item.ProductDetail?.maximum_speed} km/h
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.7,
                        }}
                      >
                        <BatteryFullIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">
                          {item.ProductDetail?.battery} Ah
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Nút */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                    px: 2,
                    py: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleAddToCart(
                        item.ProductColors[activeColorIndex]?.productColor_id
                      )
                    }
                    sx={{
                      textTransform: "none",
                      borderRadius: "10px",
                      fontWeight: 600,
                      bgcolor: "success.main",
                      "&:hover": { bgcolor: "success.dark" },
                    }}
                  >
                    Thêm vào giỏ
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/products/${item.product_id}`)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    Xem Chi Tiết
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 🔥 Nút Xem Thêm */}
      <Box display="flex" justifyContent="center" mt={5}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/products")}
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: 700,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1.1rem",
          }}
        >
          Xem thêm sản phẩm
        </Button>
      </Box>

      <ToastContainer />
    </Box>
  );
}
