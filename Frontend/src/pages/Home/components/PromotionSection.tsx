import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import promotionApi from "../../../services/promotion.api";
import FormatNumber from "../../../helpper/FormatNumber";

const PromotionCodes: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await promotionApi.getAll();
        console.log("Danh sách khuyến mãi", response);
        setPromotions(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      sx={{
        mt: 6,
        px: { xs: 4, md: 6 },
        position: "relative",
      }}
    >
      {/* Tiêu đề */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: "primary.main" }}
      >
        Mã khuyến mãi
      </Typography>

      {/* Nút điều hướng */}
      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          top: "50%",
          left: 50,
          transform: "translateY(-50%)",
          bgcolor: "white",
          boxShadow: 1,
          zIndex: 2,
          "&:hover": { bgcolor: "#f0f0f0" },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          top: "50%",
          right: 50,
          transform: "translateY(-50%)",
          bgcolor: "white",
          boxShadow: 1,
          zIndex: 2,
          "&:hover": { bgcolor: "#f0f0f0" },
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Danh sách khuyến mãi ngang */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          ml: 3.5,
          mr: 3.5,
          // justifyContent: "center",
          gap: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {promotions.map((promo) => (
          <Card
            key={promo.id}
            sx={{
              width: 400,
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#e9f0fb",
              borderRadius: 3,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
            }}
          >
            {/* Cột mã code */}
            <Box
              sx={{
                bgcolor: "#d7e4f7",
                px: 1.5,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.95rem",
                width: 140,
                textAlign: "center",
                borderRight: "2px dashed #b6c8e2",
                flexShrink: 0,
              }}
            >
              {promo.code}
            </Box>

            {/* Cột nội dung */}
            <CardContent
              sx={{
                flexGrow: 1,
                py: 1.5,
                px: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 0.5, fontWeight: "700", fontSize: 16 }}
              >
                {promo.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "primary.main",
                  cursor: "pointer",
                  mb: 0.5,
                }}
              >
                {/* <InfoOutlinedIcon sx={{ fontSize: 16 }} /> */}
                {promo.discount_type === "percentage" ? (
                  <Typography variant="body2">
                    Giảm ngay {promo.discount_value} %
                    <br />
                    Tối đa {FormatNumber(promo.max_discount_amount)} đ
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    Giảm ngay {FormatNumber(promo.discount_value)} đ
                  </Typography>
                )}
              </Box>

              {/* <Typography
                variant="caption"
                sx={{ color: "#666", display: "block", mb: 1 }}
              >
                Áp dụng với đơn hàng từ {promo.minimum_order_value}
              </Typography> */}

              <Typography
                variant="caption"
                sx={{ color: "#666", display: "block", mb: 0.5 }}
              >
                Hiệu lực đến: {promo.end_date}
              </Typography>

              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#1976d2",
                  textTransform: "none",
                  fontSize: "0.75rem",
                }}
                startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
                onClick={() => handleCopy(promo.code)}
              >
                Sao chép
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Nút xem tất cả */}
      <Box sx={{ textAlign: "center", mt: 3.5, mb: 2.5 }}>
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            fontWeight: 600,
          }}
          onClick={() => navigate("/promotions")}
        >
          Xem tất cả {promotions.length} khuyến mãi
        </Button>
      </Box>
    </Box>
  );
};

export default PromotionCodes;
