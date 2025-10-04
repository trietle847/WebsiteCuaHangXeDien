import { Box, Typography } from "@mui/material";
import HeroBanner from "./components/Herobanner";
import FeaturedProducts from "./components/FeaturedProducts";

export default function Home() {
  return (
    <Box>
      {/* Banner ở đầu tiên */}
      <HeroBanner />

      {/* Tiêu đề trang */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        <FeaturedProducts/>
      </Typography>
    </Box>
  );
}
