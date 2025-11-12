import { Box, Typography, Button, Container } from "@mui/material";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  const images = [
    {
      title: "Khuyến mãi mùa thu",
      desc: "Giảm giá lên đến 50% cho tất cả sản phẩm trong tháng này !!!",
      data: "public/banner/9618.jpg_wh860.jpg",
    },
    {
      title: "Flash Sale cuối tuần",
      desc: "Săn ngay deal khủng - mua hàng cực hời !!!",
      data: "public/banner/banner-khuyen-mai-42.webp",
    },
  ];

  return (
    <Box
      sx={{
        mt: 2,
        px: { xs: 4, md: 6 },
        overflow: "hidden",
        borderRadius: { xs: 0, md: 3 },
      }}
    >
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 260, sm: 380, md: 480 },
              backgroundImage: `url(${image.data})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.3) 70%)",
              }}
            />

            <Container
              maxWidth="lg"
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "white",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                    letterSpacing: 0.5,
                    textShadow: "3px 3px 12px rgba(0,0,0,0.6)",
                  }}
                >
                  {image.title}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    maxWidth: 600,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.9)",
                    textShadow: "2px 2px 6px rgba(0,0,0,0.4)",
                  }}
                >
                  {image.desc}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/products")}
                  sx={{
                    textTransform: "none",
                    borderRadius: "40px",
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "1rem",
                    background:
                      "linear-gradient(135deg, #ff9800 0%, #f44336 100%)",
                    boxShadow: "0px 4px 20px rgba(255,152,0,0.5)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #fb8c00 0%, #e53935 100%)",
                      boxShadow: "0px 6px 25px rgba(244,67,54,0.5)",
                    },
                  }}
                >
                  Khám phá ngay
                </Button>
              </motion.div>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
