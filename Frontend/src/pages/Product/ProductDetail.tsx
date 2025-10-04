import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

import productApi from "../../services/product.api";
import imageApi from "../../services/image.api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productApi.getById(id);
        const imagesRes = await imageApi.getById(data.product.product_id);

        setProduct(data.product);
        setImages(imagesRes.image);
        setSelectedImage(imagesRes.image[0]?.url || "");
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    };
    if (id) fetchData();
  }, [id]);

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
      {/* Gallery ảnh */}
      <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
        {/* Danh sách thumbnail */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: 400,
            overflowY: "auto",
            pr: 1,
          }}
        >
          {images.map((img, index) => (
            <CardMedia
              key={index}
              component="img"
              image={`http://localhost:3000${img.url}`}
              alt={`thumb-${index}`}
              onClick={() => setSelectedImage(img.url)}
              sx={{
                width: 70,
                height: 70,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                border:
                  selectedImage === img.url
                    ? "2px solid #1976d2"
                    : "1px solid #ddd",
                transition: "0.2s",
                "&:hover": {
                  border: "2px solid #1976d2",
                },
              }}
            />
          ))}
        </Box>

        {/* Ảnh chính */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardMedia
            component="img"
            image={`http://localhost:3000${selectedImage}`}
            alt={product.name}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
              borderRadius: 2,
              boxShadow: 2,
            }}
          />
        </Box>
      </Box>

      {/* Thông tin sản phẩm */}
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
