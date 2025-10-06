import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import productApi from "../../../services/product.api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 5,
          textAlign: "center",
          color: "primary.main",
          fontSize: { xs: "1.8rem", sm: "2.2rem" },
        }}
      >
        🌟 Sản phẩm được đánh giá cao
      </Typography>

      <Grid container spacing={4} justifyContent={"center"}>
        {products.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.product_id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 220,
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    item.images && item.images.length > 0
                      ? `http://localhost:3000${item.images[0].url}`
                      : "/no-image.png"
                  }
                  alt={item.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", // Giữ tỷ lệ, ảnh nằm đều trong khung
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {item.price.toLocaleString()} ₫
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #4cafef, #1976d2)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #42a5f5, #1565c0)",
                    },
                    mt: 1,
                  }}
                >
                  🛒 Mua ngay
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
