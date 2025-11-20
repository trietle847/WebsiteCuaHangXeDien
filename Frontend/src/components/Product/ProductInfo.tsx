import { useState } from "react";
import { Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import Description from "./Description";
import Specifications from "./Specifications";
import WarrantyProduct from "./WarrantyProduct";
import MaintenanceProduct from "./MaintenanceProduct";

export default function ProductInfo({ product }: any) {
  const [active, setActive] = useState("desc");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Kiểm tra màn hình mobile/tablet

  const tabs = [
    { key: "desc", label: "Mô tả sản phẩm" },
    { key: "spec", label: "Thông số kỹ thuật" },
    { key: "warranty", label: "Thông tin bảo hành" },
    { key: "maintenance", label: "Thông tin bảo dưỡng" },
    { key: "guide", label: "Hướng dẫn mua hàng" },
  ];

  return (
    <Box
      sx={{
        border: "2px solid #d32f2f",
        borderRadius: "12px",
        p: { xs: 2, md: 3 }, 
        mt: 4,
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, 
        gap: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "220px" },
          display: "flex",
          flexDirection: { xs: "row", md: "column" }, 
          gap: 1.5,
          
          overflowX: { xs: "auto", md: "visible" }, 
          whiteSpace: "nowrap", 
          pb: { xs: 1, md: 0 }, 

          "&::-webkit-scrollbar": { display: "none" }, 
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={active === tab.key ? "contained" : "outlined"}
            onClick={() => setActive(tab.key)}
            sx={{
              textTransform: "none",
              justifyContent: { xs: "center", md: "flex-start" }, 
              fontWeight: active === tab.key ? 700 : 500,
              borderRadius: "10px",
              py: 1.2,
              px: 2,
              minWidth: "fit-content", 
              flexShrink: 0,
              
              bgcolor: active === tab.key ? "#d32f2f" : "transparent",
              color: active === tab.key ? "#fff" : "#444",
              borderColor: active === tab.key ? "#d32f2f" : "#e0e0e0",
              boxShadow: active === tab.key ? "0 4px 10px rgba(211, 47, 47, 0.2)" : "none",
              
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: active === tab.key ? "#b71c1c" : "#f5f5f5",
                borderColor: active === tab.key ? "#b71c1c" : "#bdbdbd",
              },
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ flex: 1, minHeight: 300 }}>
        {active === "desc" && <Description product={product} />}
        
        {active === "spec" &&  (
          <Specifications productDetail={product.ProductDetail} />
        )}

        {active === "warranty" && (
          <Box>
            <WarrantyProduct product={product} />
          </Box>
        )}

        {active === "maintenance" && (
           <Box>
            <MaintenanceProduct product={product} />
          </Box>
        )}

        {active === "guide" && (
          <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
            <Typography fontSize={16} color="text.secondary" align="center">
              🚧 Hướng dẫn mua hàng đang được cập nhật...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}