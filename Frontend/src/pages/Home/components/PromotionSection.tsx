import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import promotionApi from "../../../services/promotion.api";
import FormatNumber from "../../../helpper/FormatNumber";

const PromotionCodes: React.FC = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null); // Lưu promo đang xem chi tiết
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await promotionApi.getAll();
        setPromotions(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Box sx={{ mt: 10, px: { xs: 4, md: 6 }, position: "relative" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          mb: 6,
          color: "primary.main",
          fontSize: { xs: "1.8rem", sm: "2.3rem" },
          letterSpacing: 0.5,
          gap: 1,
        }}
      >
        Khuyến mãi{" "}
        <Box component="span" sx={{ color: "red", fontWeight: 700 }}>
          nổi bật
        </Box>
      </Typography>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {promotions.map((promo) => (
          <Card
            key={promo.id}
            sx={{
              width: 350,
              flexShrink: 0,
              borderRadius: "14px",
              border: "1px solid #e0e0e0",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
              p: 2.2,
              transition: "0.2s",
              "&:hover": { boxShadow: "0px 6px 18px rgba(0,0,0,0.08)" },
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#0c8a2a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "60%",
                }}
              >
                Mã: {promo.code}
              </Typography>

              <Typography sx={{ fontSize: 13, color: "#666", fontWeight: 500 }}>
                HSD: {promo.end_date}
              </Typography>
            </Box>

            <Typography sx={{ fontSize: 14, color: "#333", lineHeight: 1.45 }}>
              {promo.discount_type === "percentage" ? (
                <>
                  Giảm {promo.discount_value}% cho đơn hàng giá trị tối thiểu{" "}
                  {FormatNumber(promo.minimum_order_value)}đ.
                </>
              ) : (
                <>Giảm trực tiếp {FormatNumber(promo.discount_value)}đ</>
              )}
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                sx={{
                  color: "#e53935",
                  borderColor: "#e53935",
                  background: "#fff",
                  "&:hover": { bgcolor: "#ccc", color: "#000" },
                  textTransform: "none",
                  fontSize: 13,
                  borderRadius: "20px",
                  px: 2.2,
                  py: 0.7,
                }}
                onClick={() => setSelectedPromo(promo)}
              >
                Chi tiết
              </Button>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#ff5722",
                  "&:hover": { bgcolor: "#e64a19" },
                  textTransform: "none",
                  fontSize: 13,
                  borderRadius: "20px",
                  px: 2.5,
                  py: 0.7,
                }}
                onClick={() => handleCopy(promo.code)}
              >
                Sao chép
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Dialog chi tiết */}
      <Dialog
        open={!!selectedPromo}
        onClose={() => setSelectedPromo(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700 }}>
          Chi tiết khuyến mãi
          <IconButton
            aria-label="close"
            onClick={() => setSelectedPromo(null)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPromo && (
            <>
              <Typography variant="h6" gutterBottom>
                Mã: {selectedPromo.code}
              </Typography>
              <Typography gutterBottom>
                Nội dung: {selectedPromo.content}
              </Typography>
              <Typography gutterBottom>
                HSD: {selectedPromo.end_date}
              </Typography>
              <Typography gutterBottom>
                {selectedPromo.discount_type === "percentage"
                  ? `Giảm ${
                      selectedPromo.discount_value
                    }% cho đơn hàng tối thiểu ${FormatNumber(
                      selectedPromo.minimum_order_value
                    )}đ. Giảm tối đa ${FormatNumber(
                      selectedPromo.max_discount_amount
                    )}đ.`
                  : `Giảm ${FormatNumber(
                      selectedPromo.discount_value
                    )}đ cho đơn hàng tối thiểu ${FormatNumber(
                      selectedPromo.minimum_order_value
                    )}đ.`}
              </Typography>
              <Typography>
                {/* Bạn có thể thêm nội dung chi tiết khác ở đây */}
                Áp dụng cho tất cả sản phẩm trong cửa hàng.
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PromotionCodes;
