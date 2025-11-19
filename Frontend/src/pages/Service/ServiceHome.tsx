import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import repairImage from "../../assets/Gemini_Repair_Service.png";
import maintenanceImage from "../../assets/Gemini_Maintenance_Service.png";

export default function ServicePage() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Đăng ký sửa chữa xe máy điện",
      description:
        "Đặt lịch sửa chữa nhanh chóng, mô tả tình trạng xe của bạn.",
      image: repairImage,
      buttonText: "Đăng ký ngay",
      path: "/services/repair",
    },
    {
      title: "Đăng ký bảo dưỡng định kỳ",
      description:
        "Theo dõi, đặt lịch và xem chi tiết các lần bảo dưỡng giúp xe bạn luôn hoạt động bền bỉ.",
      image: maintenanceImage,
      buttonText: "Đăng ký ngay",
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
        variant="h3"
        fontWeight={600}
        gutterBottom
        sx={{
          color: "primary.main",
          mb: 1,
        }}
      >
        Dịch vụ chăm sóc xe máy điện
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 5, mx: "auto" }}
      >
        Chọn dịch vụ phù hợp để đảm bảo xe của bạn luôn vận hành an toàn và hiệu
        quả nhất.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
          mt: 2,
        }}
      >
        {services.map((service, index) => (
            <Card
              key={index}
              sx={{
                position: "relative",
                borderRadius: 4,
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                height: {
                  xs: 350,
                  md: 400,
                  lg: 450,
                },
                width: "100%",
                maxWidth: 500,
                mx: "auto",
                transition: "all 0.4s ease",
                backgroundColor: "#fff",
                backgroundImage: `url(${service.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  justifyContent: "space-between",
                  p: 3,
                  height: "180px",
                  textAlign: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                  variant={"contained"}
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
                      boxShadow:"0 4px 10px rgba(25,118,210,0.3)"
                    },
                  }}
                >
                  {service.buttonText}
                </Button>
              </CardContent>
            </Card>

        ))}
      </Box>
    </Box>
  );
}
