import { Box, Typography, Divider } from "@mui/material";

export default function Specifications({ productDetail }: any) {
  const specs = [
    {
      label: "Chiều dài",
      value: productDetail?.length ? `${productDetail.length} mm` : "-",
    },
    {
      label: "Chiều rộng",
      value: productDetail?.width ? `${productDetail.width} mm` : "-",
    },
    {
      label: "Chiều cao",
      value: productDetail?.height ? `${productDetail.height} mm` : "-",
    },
    {
      label: "Chiều cao yên",
      value: productDetail?.saddle_height
        ? `${productDetail.saddle_height} mm`
        : "-",
    },
    {
      label: "Tốc độ tối đa",
      value: productDetail?.maximum_speed
        ? `${productDetail.maximum_speed} km/h`
        : "-",
    },
    { label: "Dung lượng pin", value: productDetail?.battery || "-" },
    { label: "Động cơ", value: productDetail?.vehicle_engine || "-" },
    {
      label: "Thời gian sạc",
      value: productDetail?.charging_time
        ? `${productDetail.charging_time} giờ`
        : "-",
    },
    {
      label: "Tải trọng tối đa",
      value: productDetail?.maximum_load
        ? `${productDetail.maximum_load} kg`
        : "-",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          background: "#fff",
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          boxShadow: "0px 5px 25px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="700"
          color="primary.main"
          gutterBottom
          sx={{
            fontSize: { xs: "18px", md: "20px" },
            mb: 1.5,
          }}
        >
          Thông số kỹ thuật
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 1,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {specs.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                bgcolor: index % 2 === 0 ? "#fafafa" : "#fff",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="medium"
                color="text.primary"
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
