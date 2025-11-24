import { Box, Typography } from "@mui/material";
import HeroBanner from "./components/Herobanner";
import FeaturedProducts from "./components/FeaturedProducts";
import PromotionSection from "./components/PromotionSection";
import PolicySection from "./components/PolicySection";

export default function Home() {
  return (
    <Box>
      {/* Banner ở đầu tiên */}
      <HeroBanner />
      {/* Tiêu đề trang */}
      <Typography>
        <FeaturedProducts />
      </Typography>
      {/* khuyến mãi */}
      <Typography>
        <PromotionSection />
      </Typography>
      {/* policy */}
      <PolicySection />
    </Box>
  );
}
