import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ServicePage() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Đăng ký sửa chữa xe máy điện",
      description:
        "Đặt lịch sửa chữa nhanh chóng, chọn kỹ thuật viên phù hợp và mô tả tình trạng xe của bạn.",
      image:
        "https://cdn.pixabay.com/photo/2016/03/31/19/59/motorcycle-1293020_1280.png",
      buttonText: "Đăng ký ngay",
      buttonVariant: "contained",
      path: "/services/repair",
    },
    {
      title: "Lịch bảo dưỡng định kỳ",
      description:
        "Theo dõi, đặt lịch và xem chi tiết các lần bảo dưỡng giúp xe bạn luôn hoạt động bền bỉ.",
      image:
        "https://cdn.pixabay.com/photo/2021/02/22/19/23/electric-scooter-6040023_1280.png",
      buttonText: "Xem lịch bảo dưỡng",
      buttonVariant: "outlined",
      path: "/services/maintenance",
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 8,
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        gutterBottom
        sx={{
          color: "primary.main",
          letterSpacing: 0.5,
          mb: 1,
        }}
      >
        🛠️ Dịch vụ chăm sóc xe máy điện
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 5, maxWidth: 600, mx: "auto" }}
      >
        Chọn dịch vụ phù hợp để đảm bảo xe của bạn luôn vận hành an toàn và hiệu
        quả nhất.
      </Typography>

      <Grid container spacing={4} justifyContent="center" wrap="nowrap">
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={5} key={index}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 4,
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                height: 360,
                transition: "all 0.4s ease",
                backgroundColor: "#fff",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              {/* Ảnh nền dịch vụ */}
              <Box
                component="img"
                src={service.image}
                alt={service.title}
                sx={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  bgcolor: "#f8f9fa",
                  transition: "transform 0.5s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />

              {/* Nội dung */}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "calc(100% - 180px)",
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: "#111",
                    mb: 1,
                    fontSize: "1.15rem",
                    lineHeight: 1.3,
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {service.description}
                </Typography>

                <Button
                  variant={service.buttonVariant as "contained" | "outlined"}
                  color="primary"
                  onClick={() => navigate(service.path)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    width: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow:
                        service.buttonVariant === "contained"
                          ? "0 4px 10px rgba(25,118,210,0.3)"
                          : "0 4px 8px rgba(25,118,210,0.15)",
                    },
                  }}
                >
                  {service.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
