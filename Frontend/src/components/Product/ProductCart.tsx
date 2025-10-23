import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export default function ProductCart({ product, image }) {
  const firstImage =
    image.find((c) => c.ColorImages?.length > 0)?.ColorImages?.[0]?.url ||
    "/uploads/default.jpg";
  console.log({ firstImage });
  return (
    <Link to={`/products/${product.product_id}`}>
      <Card
        sx={{
          transition: "all 0.3s ease",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          "&:hover": {
            boxShadow: 6,
            transform: "translateY(-4px)",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <CardMedia
          component="img"
          image={image ? `http://localhost:3000${firstImage}` : "/no-image.png"}
          sx={{
            height: 120,
            objectFit: "contain",
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {product.name}
          </Typography>
          <Typography color="green" fontWeight="bold">
            Giá: {product.price.toLocaleString()} ₫
          </Typography>
          <Typography variant="body2">
            Tồn kho: {product.stock_quantity}
          </Typography>
          <Typography variant="body2">{product.specifications}</Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating
              name="product-rating"
              value={product.average_rating}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" ml={0.5}>
              ({product.average_rating})
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
