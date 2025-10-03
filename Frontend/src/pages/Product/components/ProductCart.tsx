import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import type { Product } from "../../../services/product.api";
import type { Image } from "../../../services/image.api";

export default function ProductCart({
  product,
  image,
}: {
  product: Product;
  image?: Image;
}) {
  return (
    <Link to={`/products/${product.product_id}`}>
      <Card
        sx={{
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardMedia
          component="img"
          image={image?.data || "/no-image.png"}
          alt={image?.title || product.name}
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
