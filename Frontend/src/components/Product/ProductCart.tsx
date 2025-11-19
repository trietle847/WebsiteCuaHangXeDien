import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useState } from "react";

export default function ProductCart({ product, image }) {
  console.log({ product });
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const productColors = product.ProductColors || [];
  const activeColor = productColors[activeColorIndex];
  const colorImages = activeColor?.ColorImages || [];
  const firstImage = colorImages[0]?.url || "/uploads/default.jpg";
  const secondImage = colorImages[1]?.url || firstImage;
  const [hovered, setHovered] = useState(false);

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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardMedia
          component="img"
          image={`http://localhost:3000${hovered ? secondImage : firstImage}`}
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
          {/* <Typography variant="body2">
            Tồn kho: {product.ProductColors.stock_quantity}
          </Typography> */}
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
          {productColors.length > 0 && (
            <Box display="flex" gap={1} mt={1}>
              {productColors.map((pc: any, index: number) => (
                <Tooltip key={pc.color_id} title={pc.Color.name}>
                  <Box
                    onClick={(e) => {
                      e.preventDefault(); // tránh link click
                      setActiveColorIndex(index);
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: pc.Color.code,
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
