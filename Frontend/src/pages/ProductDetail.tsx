import { useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

const product = {
  id: 1,
  name: "Xe điện VinFast Evo 200",
  price: 10000000,
  stock_quantity: 12,
  specifications: "Pin LFP 3.5kWh, vận tốc tối đa 50km/h",
  image:
    "https://vinfastphunhuan.com/thumbnail/480x540x1/upload/product/782dcf1f73f2df279b72f5b2dfd7d1d8-8198.jpg",
  average_rating: 4.5,
};

export default function ProductDetail() {
  const { id } = useParams();
  console.log(id);

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
          image={product.image}
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
            value={product.average_rating}
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
