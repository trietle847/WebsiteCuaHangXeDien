import { useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import type { Product } from "../../services/product.api";
import productApi from "../../services/product.api";
import imageApi from "../../services/image.api";
import type { Image } from "../../services/image.api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<Image | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productApi.get(Number(id));
        setProduct(data.product);
        const imagesRes = await imageApi.getAll();
        const productImg = imagesRes.images.find(
          (img) => img.product_id === Number(id)
        );
        if (productImg) setImage(productImg);
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    };
    if (id) fetchData();
  }, [id]);

  // loading state
  if (!product) {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        Đang tải sản phẩm...
      </Typography>
    );
  }

  return (
    <Card
      sx={{
        display: "flex",
        p: 2,
        boxShadow: 3,
        width: "100%",
        maxWidth: 1000,
        m: "0 auto",
        mt: 4,
      }}
    >
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <CardMedia
          component="img"
          image={image ? image.data : "/no-image.png"}
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 2,
          }}
        />
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {product.name}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <Rating
            name="product-rating"
            value={product.average_rating || 0}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography variant="body2" ml={0.5}>
            ({product.average_rating})
          </Typography>
        </Box>
        <Typography color="green" fontWeight="bold" gutterBottom>
          Giá: {product.price.toLocaleString()} ₫
        </Typography>
        <Typography variant="body2" gutterBottom>
          Tồn kho: {product.stock_quantity}
        </Typography>
        <Typography variant="body2">{product.specifications}</Typography>
      </CardContent>
    </Card>
  );
}
