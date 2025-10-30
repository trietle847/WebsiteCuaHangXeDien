import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ShoppingCart } from "@mui/icons-material";
import { useCart } from "../../context/CartContext";

export default function ProductBanner({ product }: any) {
  const getFullUrl = (url: string) =>
    !url
      ? "/no-image.png"
      : url.startsWith("http")
      ? url
      : `http://localhost:3000${url}`;

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [changeImage, setChangeImage] = useState<string>("");
  const { addItem } = useCart(); // dùng context
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { quantity: 1 },
  });

  useEffect(() => {
    if (product?.ProductColors?.length > 0) {
      setSelectedColor(product.ProductColors[0]);
      reset({ quantity: 1 });
    }
  }, [product, reset]);

  useEffect(() => {
    if (selectedColor?.ColorImages?.length > 0) {
      setChangeImage(getFullUrl(selectedColor.ColorImages[0].url));
    }
  }, [selectedColor]);

  if (!product) return null;

  const handleAddToCart = async (data: any) => {
    if (!selectedColor) return;
    try {
      // Gọi addItem từ useCart
      await addItem(selectedColor.productColor_id, data.quantity);
      alert("🛒 Thêm sản phẩm vào giỏ hàng thành công!");
      reset({ quantity: 1 }); // reset số lượng về 1
    } catch (e) {
      console.error("Lỗi khi thêm vào giỏ hàng", e);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        mt: 4,
        backgroundColor: "#fff",
      }}
    >
      {/* Bên trái: hình ảnh */}
      <Box
        sx={{
          flex: 1.3,
          display: "flex",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {selectedColor?.ColorImages?.length > 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowY: "auto",
              maxHeight: 380,
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
                  "&:hover": { transform: "scale(1.08)" },
                }}
                onClick={() => setChangeImage(getFullUrl(img.url))}
              />
            ))}
          </Box>
        )}
        <Box
          sx={{
            width: 420,
            height: 380,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafafa",
          }}
        >
          <CardMedia
            component="img"
            image={changeImage || "/no-image.png"}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* Bên phải: thông tin sản phẩm */}
      <CardContent
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {product.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Rating
              value={product.average_rating || 0}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              ({product.average_rating || 0}) | 10 đánh giá
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="success.main"
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            {product.price.toLocaleString()} ₫
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tồn kho: <strong>{selectedColor?.stock_quantity || 0}</strong>
          </Typography>

          {/* Màu sắc */}
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            gap={1.5}
            mt={1}
          >
            <Typography variant="subtitle2">Màu sắc:</Typography>
            {product.ProductColors?.map((color) => (
              <Button
                key={color.productColor_id}
                sx={{
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  p: 0,
                  borderRadius: "50%",
                  backgroundColor: color.Color.code,
                  border:
                    selectedColor?.productColor_id === color.productColor_id
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  "&:hover": { transform: "scale(1.15)" },
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </Box>

          {/* Mô tả */}
          {product.description && (
            <Box
              sx={{
                backgroundColor: "#fafafa",
                p: 2,
                borderRadius: 2,
                border: "1px solid #eee",
                mt: 2,
                maxHeight: 120,
                overflowY: "auto",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: "bold" }}
              >
                Mô tả sản phẩm:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {product.description}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Form số lượng và thêm giỏ hàng */}
        <form onSubmit={handleSubmit(handleAddToCart)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              mt: 1,
            }}
          >
            <Controller
              name="quantity"
              control={control}
              rules={{
                required: true,
                min: 1,
                max: selectedColor?.stock_quantity || 1,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  size="small"
                  label="Số lượng"
                  inputProps={{
                    min: 1,
                    max: selectedColor?.stock_quantity || 1,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: 120 }}
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 1;
                    if (val > (selectedColor?.stock_quantity || 1))
                      val = selectedColor.stock_quantity;
                    if (val < 1) val = 1;
                    field.onChange(val);
                  }}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<ShoppingCart />}
              sx={{
                width: "100%",
                py: 1.2,
                borderRadius: 2,
                fontWeight: "bold",
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
