import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Description from "./Description";
import Specifications from "./Specifications";
import WarrantyProduct from "./WarrantyProduct";
import MaintenanceProduct from "./MaintenanceProduct";

export default function ProductInfo({ product }: any) {
  const [active, setActive] = useState("desc");

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
        p: 4,
        mt: 4,
        width: "100%",
        display: "flex",
        gap: 5,
      }}
    >
      <Box
        sx={{
          width: "240px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {tabs.map((tab) =>
          tab.special ? (
            <Button
              key={tab.key}
              variant="contained"
              onClick={() => setActive(tab.key)}
              sx={{
                bgcolor: "#d32f2f",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "12px",
                py: 1.8,
              }}
            >
              {tab.label}
            </Button>
          ) : (
            <Button
              key={tab.key}
              variant={active === tab.key ? "contained" : "outlined"}
              onClick={() => setActive(tab.key)}
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                fontWeight: 600,
                borderRadius: "12px",
                py: 1.5,
                bgcolor: active === tab.key ? "#d32f2f" : "#fff",
                color: active === tab.key ? "#fff" : "#444",
                borderColor: "#ccc",
                "&:hover": {
                  bgcolor: active === tab.key ? "#c62828" : "#f5f5f5",
                },
              }}
            >
              {tab.label}
            </Button>
          )
        )}
      </Box>

      <Box sx={{ flex: 1 }}>
        {active === "desc" && <Description product={product} />}
        {active === "spec" && (
          <Specifications productDetail={product.ProductDetail} />
        )}

        {active === "warranty" && (
          <Typography fontSize={18}>
            <WarrantyProduct product={product}/>
          </Typography>
        )}
        {active === "maintenance" && (
          <MaintenanceProduct product={product}/>
        )}
        {active === "guide" && (
          <Typography fontSize={18}>
            Hướng dẫn mua hàng đang cập nhật…
          </Typography>
        )}
      </Box>
    </Box>
  );
}
