import { Box, Typography } from "@mui/material";
import HeroBanner from "./components/Herobanner";
import FeaturedProducts from "./components/FeaturedProducts";
import PromotionSection from "./components/PromotionSection";
import PolicySection from "./components/PolicySection";
import { useEffect, useState } from "react";
import productApi from "../../services/product.api";
import promotionApi from "../../services/promotion.api";
import companyApi from "../../services/company.api";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [highlightCompany, setHighlightCompany] = useState<any>(null);
  const [highlightProducts, setHighlightProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, promotionRes, companyRes] = await Promise.all([
          productApi.getAll(),
          promotionApi.getAll(),
          companyApi.getAll(),
        ]);

        setProducts(productRes.data);
        setPromotions(promotionRes.data);

        const companyRandom = getRandomCompany(companyRes.data);
        setHighlightCompany(companyRandom);

        const filteredProducts = productRes.data.filter(
          (p) => p.Company?.company_id === companyRandom?.company_id
        );
        setHighlightProducts(filteredProducts);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Home:", error);
      }
    };

    fetchData();
  }, []);

  const getRandomCompany = (companies: any[]) => {
    if (!companies || companies.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * companies.length);
    return companies[randomIndex];
  };

  return (
    <Box>
      {/* Banner */}
      <HeroBanner />

      {/* Sản phẩm nổi bật chung */}
      <Box mt={8}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "primary.main",
            textAlign: "center",
            fontSize: { xs: "1.8rem", sm: "2.3rem" },
            letterSpacing: 0.5,
          }}
        >
          Sản phẩm{" "}
          <Box component="span" sx={{ color: "red", fontWeight: 600 }}>
            nổi bật
          </Box>
        </Typography>

        <FeaturedProducts products={products} promotions={promotions} />
      </Box>

      {/* Khuyến mãi */}
      <PromotionSection />

      {/* xe theo công ty */}
      {highlightCompany && (
        <Box mt={5}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              // mb: 0,
              color: "primary.main",
              textAlign: "center",
              fontSize: { xs: "1.8rem", sm: "2.3rem" },
              letterSpacing: 0.5,
            }}
          >
            <Box component="span" sx={{ color: "red", fontWeight: 600 }}>
              {highlightCompany.name}
            </Box>
          </Typography>

          <FeaturedProducts
            products={highlightProducts}
            promotions={promotions}
          />
        </Box>
      )}

      {/* Policy */}
      <PolicySection />
    </Box>
  );
}
