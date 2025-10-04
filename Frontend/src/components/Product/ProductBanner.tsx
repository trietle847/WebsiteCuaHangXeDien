import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import type { Product } from "../../services/product.api";
import type { Image } from "../../services/image.api";

export default function ProductBanner({
  product,
  image,
}: {
  product: Product;
  image?: Image;
}) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        p: 3,
        boxShadow: 4,
        borderRadius: 3,
        width: "100%",
        mt: 4,
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: { xs: 2, sm: 0 },
        }}
      >
        <CardMedia
          component="img"
          image={image?.data || "/no-image.png"}
          alt={product.name}
          sx={{
            width: { xs: "80%", sm: "100%" },
            maxHeight: 300,
            objectFit: "contain",
            borderRadius: 2,
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {product.name}
        </Typography>

        <Box display="flex" alignItems="center" mb={1.5} sx={{ gap: 1 }}>
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
          color="success.main"
          fontWeight="bold"
          variant="h6"
          gutterBottom
        >
          Giá: {product.price.toLocaleString()} ₫
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Tồn kho: {product.stock_quantity}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, whiteSpace: "pre-line" }}
        >
          {product.specifications}
        </Typography>
      </CardContent>
    </Card>
  );
}
