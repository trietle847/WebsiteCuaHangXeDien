import { Box, Typography } from "@mui/material";

const policies = [
  {
    icon: "https://bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_6.png?1758009468922",
    title: "Có dịch vụ giao hàng tận nhà",
    desc: "Giao xe đến nhà khách hàng trực tiếp trên toàn quốc",
  },
  {
    icon: "https://bizweb.dktcdn.net/100/519/812/themes/954445/assets/chinhsach_2.png",
    title: "Miễn phí đổi - trả",
    desc: "Đối với sản phẩm lỗi sản xuất hoặc vận chuyển",
  },
  {
    icon: "https://bizweb.dktcdn.net/100/519/812/themes/954445/assets/chinhsach_3.png",
    title: "Hỗ trợ nhanh chóng",
    desc: "Gọi Hotline: 0123456789 để được hỗ trợ ngay lập tức",
  },
  {
    icon: "https://bizweb.dktcdn.net/100/519/812/themes/954445/assets/chinhsach_4.png",
    title: "Ưu đãi ngập tràn",
    desc: "Đăng ký ngay để nhận nhiều khuyến mãi",
  },
];

export default function PolicySection() {
  return (
    <Box sx={{ width: "100%", py: 4, px: { xs: 2, md: 6 } }}>
      <Box
        sx={{
          backgroundColor: "#d50000",
          borderRadius: 4,
          p: { xs: 2, md: 4 },
          overflowX: { xs: "auto", md: "visible" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "max-content",
            // Mobile: cuộn ngang
            flexWrap: "nowrap",
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {policies.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                minWidth: { xs: 200, sm: 250, md: "auto" },
                scrollSnapAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                bgcolor: "transparent",
                px: 2,
              }}
            >
              <Box
                component="img"
                src={item.icon}
                alt={item.title}
                sx={{
                  width: 50,
                  height: 50,
                  mb: 1.5,
                  filter: "brightness(0) invert(1)",
                }}
              />
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  opacity: 0.9,
                  lineHeight: 1.4,
                }}
              >
                {item.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
