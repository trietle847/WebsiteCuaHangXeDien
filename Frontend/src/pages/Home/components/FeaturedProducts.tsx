import {
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import SpeedIcon from "@mui/icons-material/Speed";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import productApi from "../../../services/product.api";
import { useNavigate, Link } from "react-router-dom";
import cartApi from "../../../services/cart.api";
import { useCart } from "../../../context/CartContext";
import promotionApi from "../../../services/promotion.api";
import FormatNumber from "../../../helpper/FormatNumber";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  // const [promotions, setPromotions] = useState<any[]>([])
  // const [selectPromotion, setSelectPromotion] = useState<any>||(null)
  const [bestPromotion, setBestPromotion] = useState<any>(null);
  const [selectedColors, setSelectedColors] = useState<Record<number, number>>(
    {}
  );
  const [hovered, setHovered] = useState<number | null>(null);
  const { addItem } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, cartsRes, promotionRes] = await Promise.all([
          productApi.getAll(),
          cartApi.getAll(),
          promotionApi.getAll(),
        ]);

        const validPromotios = promotionRes.data.filter((p) => {
          return new Date(p.end_date) > new Date();
        });

        console.log("Danh sách khuyến mãi còn hạn", validPromotios);
        const bestPromotion = validPromotios.reduce((max, curr) => {
          return curr.promotional_percentage > max.promotional_percentage
            ? curr
            : max;
        }, validPromotios[0]);

        console.log(promotionRes);
        console.log("Khuyến mãi tốt nhất", bestPromotion);

        setProducts(productsRes.data);
        setCartIds(cartsRes.data.Items.map((p) => p.product_id));
        setBestPromotion(bestPromotion);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productColorId: number) => {
    try {
      console.log(productColorId);
      await addItem(productColorId, 1);
      setCartIds((prev) => [...prev, productColorId]);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 6,
          textAlign: "center",
          color: "primary.main",
          fontSize: { xs: "1.8rem", sm: "2.3rem" },
          letterSpacing: 0.5,
        }}
      >
        🛵 Sản phẩm nổi bật
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {products.map((item) => {
          const productColors = item.ProductColors || [];
          const activeColorIndex = selectedColors[item.product_id] ?? 0;
          const activeColor = productColors[activeColorIndex];
          const colorImgs = activeColor?.ColorImages || [];
          const discountPercent = bestPromotion?.promotional_percentage || 0;
          const discountedPrice = Math.round(
            item.price * (1 - discountPercent / 100)
          );

          const img1 = colorImgs[0]
            ? `http://localhost:3000${colorImgs[0].url}`
            : "/no-image.png";
          const img2 = colorImgs[1]
            ? `http://localhost:3000${colorImgs[1].url}`
            : img1;

          const isHovered = hovered === item.product_id;

          return (
            <Grid item xs={12} sm={6} md={3} key={item.product_id}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  height: 500,
                  width: 350,
                  transition: "all 0.4s ease",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  },
                }}
                onMouseEnter={() => setHovered(item.product_id)}
                onMouseLeave={() => setHovered(null)}
              >
                {discountPercent > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      bgcolor: "#d32f2f",
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    -{discountPercent}%
                  </Box>
                )}

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    // mb: 1,
                    mt: 3,
                    textAlign: "center",
                    color: "#111",
                    fontSize: "1.5rem",
                    ":hover": { color: "#f44336" },
                  }}
                >
                  {item.name}
                </Typography>
                {/* Hai ảnh chồng lên nhau để tạo hiệu ứng hover */}
                <Box sx={{ position: "relative", width: "100%", height: 250 }}>
                  <Box
                    component="img"
                    src={img1}
                    alt={item.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      p: 3,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      opacity: isHovered ? 0 : 1,
                      transition: "opacity 0.6s ease",
                    }}
                  />
                  <Box
                    component="img"
                    src={img2}
                    alt={item.name + " - ảnh phụ"}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      p: 3,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.6s ease",
                    }}
                  />
                </Box>

                {/* Nội dung chia 2 cột */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1,
                    px: 2,
                    mt: 1,
                    alignItems: "start",
                  }}
                >
                  {/* Cột trái */}
                  <Box sx={{ textAlign: "left" }}>
                    <Link
                      to={`/products/${item.product_id}`}
                      style={{ textDecoration: "none" }}
                    ></Link>

                    <Box sx={{ mb: 1 }}>
                      {discountPercent > 0 ? (
                        <>
                          <Typography
                            sx={{
                              color: "#999",
                              textDecoration: "line-through",
                              fontSize: "0.95rem",
                            }}
                          >
                            {FormatNumber(item.price)} ₫
                          </Typography>
                          <Typography
                            sx={{
                              color: "#d32f2f",
                              fontWeight: 700,
                              fontSize: "1.1rem",
                            }}
                          >
                            {FormatNumber(discountedPrice)} ₫{" "}
                            <Typography
                              component="span"
                              sx={{
                                color: "#2e7d32",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                              }}
                            >
                              (-{discountPercent}%)
                            </Typography>
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            color: "#f44336",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          {FormatNumber(item.price)} ₫
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      sx={{ color: "#666", fontSize: "0.9rem", mb: 1 }}
                    >
                      Hãng: {item.Company?.name || "Đang cập nhật"}
                    </Typography>

                    {/* Màu sắc */}
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      {productColors.map((pc: any, index: number) => (
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
                                  ? "2px solid #333"
                                  : "1px solid #ccc",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  {/* Cột phải: thông số kỹ thuật */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      bgcolor: "#f5f6fa",
                      borderRadius: 2,
                      p: 1.5,
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <BatteryChargingFullIcon
                        sx={{ fontSize: 18, color: "#1976d2" }}
                      />
                      <Typography variant="body2">
                        {item.ProductDetail?.charging_time} giờ
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <SpeedIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                      <Typography variant="body2">
                        {item.ProductDetail?.maximum_speed} km/h
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <BatteryFullIcon
                        sx={{ fontSize: 18, color: "#1976d2" }}
                      />
                      <Typography variant="body2">
                        {item.ProductDetail.battery} mAh

                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Nút hành động */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    mt: 3,
                    mb: 2,
                    px: 2,
                  }}
                >
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() =>
                        handleAddToCart(
                          item.ProductColors[activeColorIndex]?.productColor_id
                        )
                      }
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        fontWeight: 600,
                        px: 2,
                        py: 1,
                        fontSize: "0.9rem",
                        bgcolor: "#2e7d32",
                        "&:hover": { bgcolor: "#1b5e20" },
                        flex: 1,
                        mr: 1,
                      }}
                    >
                      Thêm vào giỏ
                    </Button>

                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => navigate(`/products/${item.product_id}`)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "10px",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      fontSize: "0.9rem",
                      bgcolor: "#1976d2",
                      "&:hover": { bgcolor: "#115293" },
                      flex: 1,
                      ml: 1,
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
    </Container>
  );
}
