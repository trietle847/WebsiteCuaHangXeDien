import { Box, Typography } from "@mui/material";
import HeroBanner from "./components/Herobanner";
import FeaturedProducts from "./components/FeaturedProducts";
import PromotionSection from "./components/PromotionSection";

export default function Home() {
  return (
    <Box>
      {/* Banner ở đầu tiên */}
      <HeroBanner />
      {/* Tiêu đề trang */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        <FeaturedProducts />
      </Typography>
      {/* khuyến mãi */}
      <Typography>
        <PromotionSection/>
      </Typography>
    </Box>
  );
}
