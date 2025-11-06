import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import promotionApi from "../../../services/promotion.api";

interface Promotion {
  id: number;
  code: string;
  description: string;
  expireDate: string;
  minValue: number;
  discount: string;
  isExpired: boolean;
}

const PromotionCodes: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await promotionApi.getAll();
        console.log(response);
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
    <Box sx={{ mt: 6, px: { xs: 2, md: 6 }, position: "relative" }}>
      {/* Tiêu đề */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 3, color: "primary.main" }}
      >
        🎁 Mã khuyến mãi
      </Typography>

      {/* Nút điều hướng */}
      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          top: "50%",
          left: 20,
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
          right: 20,
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
          justifyContent: "center",
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
              minWidth: 250,
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
                minWidth: 100,
                maxWidth: 150,
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
                py: 2.5,
                px: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5 }}>
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
                <Typography variant="body2">
                  Giảm ngay {promo.promotional_percentage} %
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{ color: "#666", display: "block", mb: 1 }}
              >
                {promo.end_date}
              </Typography>

              {new Date(promo.end_date) < new Date() ? (
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{
                    fontSize: "0.75rem",
                    color: "#777",
                    borderColor: "#ccc",
                    textTransform: "none",
                  }}
                >
                  Hết hạn
                </Button>
              ) : (
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
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Nút xem tất cả */}
      <Box sx={{ textAlign: "center", mt: 2.5, mb: 2.5 }}>
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
