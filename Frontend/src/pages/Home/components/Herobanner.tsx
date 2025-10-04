import { Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeroBanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  // demo banner có hình thật
  const images = [
    {
      title: "Khuyến mãi mùa thu",
      desc: "Giảm giá lên đến 50% cho tất cả sản phẩm",
      data: "public/banner/9618.jpg_wh860.jpg",
    },
    {
      title: "Flash Sale cuối tuần",
      desc: "Mua ngay kẻo lỡ 🚀",
      data: "public/banner/banner-khuyen-mai-42.webp",
    },
  ];

  return (
    <Box sx={{ width: "100vw", overflow: "hidden", mt: 2 }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: "100vw",
              height: { xs: "200px", md: "450px" },
              backgroundImage: `url(${image.data})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textAlign: "center",
            }}
          >
            {/* Overlay mờ để chữ rõ hơn */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
              }}
            />

            {/* Nội dung chữ */}
            <Box sx={{ position: "relative", zIndex: 2, px: 2 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
                }}
              >
                {image.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 3, textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}
              >
                {image.desc}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  textTransform: "none",
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  background: "linear-gradient(135deg, #ff9800, #f44336)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #fb8c00, #e53935)",
                  },
                }}
              >
                Khám phá ngay
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
