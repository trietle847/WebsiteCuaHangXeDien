import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface ProductCartProps {
  product: {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    specifications: string;
    image: string;
    average_rating: number;
  };
}

export default function ProductCart({ product }: ProductCartProps) {
  return (
    <Link to={`/product/${product.id}`}>
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
          image={product.image}
          alt={product.name}
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
        </CardContent>
      </Card>
    </Link>
  );
}
