import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function ProductBanner({ product }: any) {
  const getFullUrl = (url: string) => {
    if (!url) return "/no-image.png";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [changeImage, setChangeImage] = useState<string>("");

  useEffect(() => {
    if (product?.ProductColors?.length > 0) {
      setSelectedColor(product.ProductColors[0]);
    }
  }, [product]);

  useEffect(() => {
    if (selectedColor?.ColorImages?.length > 0) {
      setChangeImage(getFullUrl(selectedColor.ColorImages[0].url));
    }
  }, [selectedColor]);

  if (!product) return null;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, md: 4 },
        boxShadow: 6,
        borderRadius: 4,
        width: "100%",
        mt: 4,
        bgcolor: "#fff",
        overflow: "hidden",
        gap: 4,
      }}
    >
      <Box
        sx={{
          flex: 1.5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {selectedColor?.ColorImages?.length > 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxHeight: 350,
            }}
          >
            {selectedColor.ColorImages.slice(0, 6).map((img) => (
              <CardMedia
                key={img.image_id}
                component="img"
                image={getFullUrl(img.url)}
                alt={img.title}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    changeImage === getFullUrl(img.url)
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => setChangeImage(getFullUrl(img.url))}
              />
            ))}
          </Box>
        )}

        <Box
          sx={{
            width: 420,
            height: 360,
            borderRadius: 3,
            boxShadow: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fafafa",
          }}
        >
          <CardMedia
            component="img"
            image={changeImage || "/no-image.png"}
            alt={product.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          gap: 1.5,
          width: "100%",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          {product.name}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Rating
            name="product-rating"
            value={product.average_rating || 0}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            ({product.average_rating || 0}) | 10 Đánh giá
          </Typography>
        </Box>

        <Typography
          variant="h6"
          color="success.main"
          fontWeight="bold"
          sx={{ mt: 1 }}
        >
          {product.price.toLocaleString()} ₫
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Tồn kho: {product.stock_quantity}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1.5,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
            textAlign: "justify",
            maxWidth: 400,
          }}
        >
          {product.specifications}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Màu sắc:
          </Typography>

          {product.ProductColors?.map((color) => (
            <Button
              key={color.productColor_id}
              sx={{
                minWidth: 28,
                height: 28,
                p: 0,
                borderRadius: "50%",
                background: color.Color.code,
                border:
                  selectedColor?.productColor_id === color.productColor_id
                    ? "2px solid #1976d2"
                    : "1px solid #ccc",
                "&:hover": { transform: "scale(1.1)" },
              }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert("Đã thêm vào giỏ hàng!")}
        >
          🛒 Đặt hàng ngay
        </Button>
      </CardContent>
    </Card>
  );
}
