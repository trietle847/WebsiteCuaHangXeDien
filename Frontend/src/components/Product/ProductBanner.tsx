import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import cartApi from "../../services/cart.api";
import { ShoppingCart, FlashOn } from "@mui/icons-material";

export default function ProductBanner({ product }: any) {
  const getFullUrl = (url: string) =>
    !url
      ? "/no-image.png"
      : url.startsWith("http")
      ? url
      : `http://localhost:3000${url}`;

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [changeImage, setChangeImage] = useState<string>("");
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
    const item = { ...data, productColorId: selectedColor.productColor_id };
    try {
      await cartApi.create(item);
      alert("🛒 Thêm sản phẩm vào giỏ hàng thành công!");
      reset();
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
      {/* Gallery bên trái */}
      <Box
        sx={{
          flex: 1.4,
          display: "flex",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Hình nhỏ */}
        {selectedColor?.ColorImages?.length > 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowY: "auto",
              maxHeight: 400,
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

        {/* Ảnh chính */}
        <Box
          sx={{
            width: 420,
            height: 400,
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

      {/* Thông tin sản phẩm */}
      <CardContent
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
        }}
      >
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

        <Typography variant="h5" color="success.main" fontWeight="bold">
          {product.price.toLocaleString()} ₫
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Tồn kho: <strong>{selectedColor?.stock_quantity || 0}</strong>
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Màu sắc */}
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
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

        {/* Form nhập số lượng */}
        <form onSubmit={handleSubmit(handleAddToCart)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
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
          </Box>

          {/* Nút hành động */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<ShoppingCart />}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<FlashOn />}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                borderWidth: 2,
              }}
            >
              Mua ngay
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
