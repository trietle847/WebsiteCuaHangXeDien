import { Box } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeroBanner() {
  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = ["/banner/banner1.jpg", "/banner/banner2.jpg"];

  return (
    <Box
      sx={{
        mt: 2,
        px: { xs: 0, md: 4 },
        overflow: "hidden",
        borderRadius: { xs: 0, md: 3 },
      }}
    >
      <Slider {...settings}>
        {images.map((src, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: "100%",
              // height: 600,
              height: {
                xs: 180, // mobile nhỏ
                sm: 240, // mobile lớn
                md: 360, // tablet
                lg: 600, // desktop
              },
            }}
          >
            <Box
              component="img"
              src={src}
              alt={`banner-${index}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
