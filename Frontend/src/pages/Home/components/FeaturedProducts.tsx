import {
  Container,
  Typography,
  Grid,
  Card,
  IconButton,
  Tooltip,
  Button,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import SpeedIcon from "@mui/icons-material/Speed";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";

import { useEffect, useState } from "react";
import productApi from "../../../services/product.api";
import { useNavigate, Link } from "react-router-dom";
import favoriteApi from "../../../services/cart.api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);

  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, favouritesRes] = await Promise.all([
          productApi.getAll(),
          favoriteApi.getAll(),
        ]);

        setProducts(productsRes.data);
        setFavouriteIds(favouritesRes.data.map((p) => p.product_id));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleFavourite = async (product_id) => {
    try {
      const isFav = favouriteIds.includes(product_id);

      if (isFav) {
        await favoriteApi.delete(product_id);
        setFavouriteIds((f) => f.filter((id) => id !== product_id));
      } else {
        await favoriteApi.create({ productId: product_id });
        setFavouriteIds((prev) => [...prev, product_id]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
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
        🌟 Sản phẩm nổi bật
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {products.map((item) => {
          const colorImgs = item.ProductColors?.[0]?.ColorImages || [];
          const firstImg = colorImgs[0]
            ? `http://localhost:3000${colorImgs[0].url}`
            : "/no-image.png";

          return (
            <Grid item xs={12} sm={6} md={3} key={item.product_id}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  height: 450,
                  width: 350,
                  transition: "all 0.4s ease",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={firstImg}
                  alt={item.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                    p: 3,
                  }}
                  className="product-img"
                />

                <Box
                  className="product-info"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: 0,
                    transform: "translateY(25px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ mt: 2 }}>
                    <Link
                      to={`/products/${item.product_id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: "#111",
                          fontSize: "1.05rem",
                          ":hover": { color: "#f44336" },
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Link>

                    <Typography
                      sx={{
                        mb: 1,
                        color: "#f44336",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.price.toLocaleString()} ₫
                    </Typography>

                    <Typography
                      sx={{
                        color: "#666",
                        fontSize: "0.9rem",
                        mb: 1,
                      }}
                    >
                      Hãng: {item.Company?.name || "Đang cập nhật"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      width: "100%",
                      bgcolor: "#f5f6fa",
                      borderRadius: 2,
                      py: 1,
                      mt: 2,
                      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <BatteryChargingFullIcon
                        sx={{ fontSize: 18, color: "#1976d2" }}
                      />
                      <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                        {item.ProductDetail.charging_time} giờ
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <SpeedIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                      <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                        {item.ProductDetail.maximum_speed} km/h
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <BatteryFullIcon
                        sx={{ fontSize: 18, color: "#1976d2" }}
                      />
                      <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                        {item.ProductDetail.battery}mAh
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      mt: 3,
                      mb: 1,
                      px: 1,
                    }}
                  >
                    <Tooltip
                      title={
                        favouriteIds.includes(item.product_id)
                          ? "Đã thêm vào yêu thích"
                          : "Thêm vào yêu thích"
                      }
                      arrow
                    >
                      <IconButton
                        onClick={() => handleFavourite(item.product_id)}
                        sx={{
                          color: favouriteIds.includes(item.product_id)
                            ? "red"
                            : "#1976d2",
                          transition: "all 0.3s ease",
                          "&:hover": { transform: "scale(1.15)" },
                        }}
                      >
                        {favouriteIds.includes(item.product_id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>

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
                      }}
                    >
                      Xem Chi Tiết
                    </Button>
                  </Box>
                </Box>

                {/* hiệu ứng chuyển ảnh cũ */}
                <style>
                  {`
                  .MuiCard-root:hover .product-img {
                    opacity: 0;
                    transform: scale(1.05);
                  }
                  .MuiCard-root:hover .product-info {
                    opacity: 1;
                    transform: translateY(0);
                  }
                `}
                </style>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
