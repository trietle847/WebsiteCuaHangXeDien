import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ShoppingCart } from "@mui/icons-material";
import { useCart } from "../../context/CartContext";
import {
  addCheckoutItem,
  clearCheckoutItems,
} from "../../redux/slices/checkoutSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormatNumber from "../../helpper/FormatNumber";

export default function ProductBanner({ product }: any) {
  const getFullUrl = (url: string) =>
    !url
      ? "/no-image.png"
      : url.startsWith("http")
      ? url
      : `http://localhost:3000${url}`;

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [changeImage, setChangeImage] = useState<string>("");
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { quantity: 1 },
  });

  const quantity = watch("quantity");
  const token = localStorage.getItem("token");

  // Chọn màu mặc định
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

  const handleRequireLogin = () => {
    if (!token) {
      alert("⚠️ Vui lòng đăng nhập để tiếp tục!");
      navigate("/login", { state: { from: location.pathname } });
      return true;
    }
    return false;
  };

  // Mua ngay
  const handleBuyNow = () => {
    if (handleRequireLogin() || !selectedColor) return;

    dispatch(clearCheckoutItems());
    const formattedItem = {
      productColorId: selectedColor.productColor_id,
      name: product.name,
      price: product.price,
      colorName: selectedColor.Color.name,
      colorCode: selectedColor.Color.code,
      image: selectedColor.ColorImages?.[0]?.url || "",
      quantity,
      quantityMax: selectedColor.stock_quantity,
    };

    dispatch(addCheckoutItem([formattedItem]));
    navigate("/checkout");
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = async (data: any) => {
    if (handleRequireLogin() || !selectedColor) return;

    try {
      await addItem(selectedColor.productColor_id, data.quantity);
      alert("🛒 Thêm sản phẩm vào giỏ hàng thành công!");
      reset({ quantity: 1 });
    } catch (e) {
      console.error("Lỗi khi thêm vào giỏ hàng", e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        // p: { xs: 2, md: 0 },
        borderRadius: 3,
        // mt: 4,
        backgroundColor: "#fff",
        // border: "1px solid #d32f2f",
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
          flexDirection: "row-reverse",
        }}
      >
        {selectedColor?.ColorImages?.length > 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {selectedColor.ColorImages.map((img) => (
              <img
                key={img.image_id}
                src={getFullUrl(img.url)}
                alt={img.title}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    changeImage === getFullUrl(img.url)
                      ? "2px solid #d32f2f"
                      : "1px solid #e0e0e0",
                  transition: "0.3s",
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
            border: "2px solid #d32f2f",
          }}
        >
          <img
            src={changeImage || "/no-image.png"}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {product.name}
          </Typography>

          <Typography
            variant="h5"
            color="success.main"
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            <Box component="span" sx={{ color: "black", fontSize: 18 }}>
              Giá bán:{" "}
            </Box>
            {FormatNumber(product.price)} ₫
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Tồn kho: <strong>{selectedColor?.stock_quantity || 0}</strong>
          </Typography>

          {/* Ratting */}
          <Box display="flex" alignItems="center" gap={0.5} mt={1}>
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
                  "&:hover": {
                    backgroundColor: color.Color.code,
                  },
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </Box>
        </Box>

        {/* Form số lượng và 2 nút nằm ngang */}
        <form onSubmit={handleSubmit(handleAddToCart)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {/* Số lượng */}
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

            {/* 2 nút nằm ngang */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<ShoppingCart />}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                THÊM VÀO GIỎ
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="contained"
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  backgroundColor: "#D71920",
                  "&:hover": { backgroundColor: "#d94c53ff" },
                }}
              >
                MUA NGAY
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>

      {/* Thông tin cam kết */}
      <Box
        sx={{
          borderRadius: 2,
          backgroundColor: "#fff",
          border: "2px solid #d32f2f",
          overflow: "hidden",
          // mt: 3,
        }}
      >
        <Box
          sx={{
            background: "#d32f2f",
            p: 1.2,
            textAlign: "center",
          }}
        >
          <Typography fontWeight="bold" fontSize={18} sx={{ color: "#fff" }}>
            Cam kết bán hàng
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            p: 2.5,
            mt: 2.5,
          }}
        >
          {[
            {
              img: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_1.png",
              title: "Sản phẩm",
              sub: "chính hãng",
            },
            {
              img: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_2.png",
              title: "Giá tốt",
              sub: "trực tiếp",
            },
            {
              img: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_3.png",
              title: "Combo quà",
              sub: "chất lượng",
            },
            {
              img: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_4.png",
              title: "Trả góp",
              sub: "lãi suất thấp",
            },
            {
              img: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_5.png",
              title: "Bảo hành",
              sub: "3 - 5 năm",
            },
            {
              img: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_6.png",
              title: "Giao hàng",
              sub: "tận nhà",
            },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{ width: 48, height: 48 }}
              />

              <Typography fontWeight="bold">{item.title}</Typography>
              <Typography fontSize={13} color="text.secondary">
                {item.sub}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
