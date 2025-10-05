import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

export default function ProductBanner({ product, image }) {
  const getFullUrl = (url: string) => {
    if (!url) return "/no-image.png";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  const [changeImage, setChangeImage] = useState<string>(
    getFullUrl(image?.[0]?.url)
  );

  useEffect(() => {
    if (image && image.length > 0) {
      setChangeImage(getFullUrl(image[0].url));
    }
  }, [image]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: { xs: 2, md: 3 },
        boxShadow: 6,
        borderRadius: 4,
        width: "100%",
        mt: 4,
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {image && image.length > 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxHeight: 350,
              pr: 1,
            }}
          >
            {image.slice(0, 5).map((img, index) => (
              <CardMedia
                key={index}
                component="img"
                image={
                  img.url ? `http://localhost:3000${img.url}` : "/no-image.png"
                }
                alt={img.title}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 2,
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    changeImage === img.url ? "2px solid #000000" : "none",
                }}
                onClick={() => setChangeImage(getFullUrl(img.url))}
              />
            ))}
          </Box>
        )}

        <Box
          sx={{
            width: 400,
            height: 350,
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f9f9f9",
          }}
        >
          <CardMedia
            component="img"
            image={changeImage}
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
          ml: { md: 4 },
          mt: { xs: 3, md: 0 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1.5,
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
            ({product.average_rating || 0})
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
          }}
        >
          {product.specifications}
        </Typography>
      </CardContent>
    </Card>
  );
}
