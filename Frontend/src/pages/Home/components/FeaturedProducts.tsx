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
import productApi from "../../../services/product.api";
import { useEffect, useState } from "react";
import imageApi from "../../../services/image.api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.getAll();
      const productWithImages = await Promise.all(
        response.data.map(async (prod: any) => {
          try {
            const imgRes = await imageApi.getById(prod.product_id);
            return {
              ...prod,
              image: imgRes.data[0].url,
            };
          } catch (error) {
            console.error(
              `Không lấy được ảnh của sản phẩm ${prod.product_id}`,
              error
            );
            return { ...prod, image: null };
          }
        })
      );
      setProducts(productWithImages);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
      >
        🌟 Sản phẩm được đánh giá cao
      </Typography>

      <Grid container spacing={4}>
        {products.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.product_id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                image={
                  item.image
                    ? `http://localhost:3000${item.image}`
                    : "/no-image.png"
                }
                alt={item.name}
                sx={{
                  height: 220,
                  objectFit: "contain",
                  backgroundColor: "#fafafa",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {item.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  {item.price.toLocaleString()} VNĐ
                </Typography>
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                      background: "linear-gradient(135deg, #4cafef, #1976d2)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #42a5f5, #1565c0)",
                      },
                    }}
                  >
                    🛒 Mua ngay
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
