import { Box, Typography, Grid, Link } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  if (location.pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1f1f1f",
        color: "#fff",
        pt: 4,
        pb: 2,
        mt: 5,
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent={"space-around"}
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          px: 2,
        }}
      >
        {/* Cột 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Thông tin cửa hàng
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
            Cửa hàng E-MoTo <br />
            Địa chỉ: Quận Ninh Kiều, TP. Cần Thơ <br />
            Điện thoại: 0123456789 <br />
            Email: student@gmail.com
          </Typography>
        </Grid>

        {/* Cột 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Liên kết nhanh
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link href="/" underline="hover" color="#ccc">
              Trang chủ
            </Link>
            <Link href="/products" underline="hover" color="#ccc">
              Sản phẩm
            </Link>
            <Link href="/services" underline="hover" color="#ccc">
              Dịch vụ
            </Link>
          </Box>
        </Grid>

        {/* Cột 3 */}
        <Grid item xs={12} sm={12} md={5}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Vị trí chúng tôi
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: 180,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #444",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.2579953737895!2d105.76804047653654!3d10.029939272709327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zxJDhuqFpIGjhu41jIEPhuqduIFRoMaw!5e0!3m2!1svi!2s!4v1732533880001"
            ></iframe>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Typography variant="body2" align="center" sx={{ mt: 3, opacity: 0.6 }}>
        © {new Date().getFullYear()} – All rights reserved.
      </Typography>
    </Box>
  );
}
