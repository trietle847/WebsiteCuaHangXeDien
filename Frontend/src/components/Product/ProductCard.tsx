import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Tooltip,
  Dialog,
} from "@mui/material";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useState } from "react";

export default function ProductCard({ product }: any) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const productColors = product.ProductColors || [];
  const activeColor = productColors[activeColorIndex];
  const colorImages = activeColor?.ColorImages || [];
  const firstImage = colorImages[0]?.url || "/uploads/default.jpg";
  const secondImage = colorImages[1]?.url || firstImage;

  const [openZoom, setOpenZoom] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Link to={`/products/${product.product_id}`}>
        <Card
          sx={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            border: "1px solid #e0e0e0",
            "&:hover": {
              boxShadow: 6,
              transform: "translateY(-4px)",
            },
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* IMAGE WITH ZOOM CLICK */}
          <Box
            onClick={(e) => {
              e.preventDefault();
              setOpenZoom(true);
            }}
          >
            <CardMedia
              component="img"
              image={`http://localhost:3000${
                hovered ? secondImage : firstImage
              }`}
              sx={{
                height: 120,
                objectFit: "contain",
                transition: "transform 0.4s ease",
                transform: hovered ? "scale(1.2)" : "scale(1)",
                cursor: "zoom-in",
              }}
            />
          </Box>

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {product.name}
            </Typography>

            <Typography color="green" fontWeight="bold">
              Giá: {product.price.toLocaleString()} ₫
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

            {/* COLOR OPTIONS */}
            {productColors.length > 0 && (
              <Box display="flex" gap={1} mt={1}>
                {productColors.map((pc: any, index: number) => (
                  <Tooltip key={pc.color_id} title={pc.Color.name}>
                    <Box
                      onClick={(e) => {
                        e.preventDefault();
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
      <Dialog open={openZoom} onClose={() => setOpenZoom(false)} maxWidth="lg">
        <img
          src={`http://localhost:3000${firstImage}`}
          style={{ width: "100%", height: "auto" }}
        />
      </Dialog> 
    </>
  );
}
