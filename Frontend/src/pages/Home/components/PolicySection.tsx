import { Box, Typography, Grid } from "@mui/material";

const policies = [
  {
    icon: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/camket_6.png?1758009468922",
    title: "Có dịch vụ giao hàng tận nhà",
    desc: "Giao xe đến nhà khách hàng trực tiếp trên toàn quốc",
  },
  {
    icon: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/chinhsach_2.png",
    title: "Miễn phí đổi - trả",
    desc: "Đối với sản phẩm lỗi sản xuất hoặc vận chuyển",
  },
  {
    icon: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/chinhsach_3.png",
    title: "Hỗ trợ nhanh chóng",
    desc: "Gọi Hotline: 0123456789 để được hỗ trợ ngay lập tức",
  },
  {
    icon: "//bizweb.dktcdn.net/100/519/812/themes/954445/assets/chinhsach_4.png",
    title: "Ưu đãi ngập tràng",
    desc: "Đăng ký ngay để nhận nhiều khuyến mãi",
  },
];

export default function PolicySection() {
  return (
    <Box
      sx={{
        width: "100%",
        py: 4,
        px: { xs: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#d50000",
          borderRadius: 4,
          p: { xs: 3, md: 4 },
        }}
      >
        <Grid container spacing={3} justifyContent="space-between">
          {policies.map((item, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={idx}
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <Box
                component="img"
                src={item.icon}
                alt={item.title}
                sx={{
                  width: 60,
                  height: 60,
                  mb: 1.5,
                  filter: "brightness(0) invert(1)", // biến icon thành màu trắng
                }}
              />

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "1.05rem",
                  fontWeight: 700,
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
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
