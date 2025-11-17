import { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import companyApi from "../../services/company.api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Description({ product }: any) {
  const [company, setCompany] = useState<any>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const [openWarranty, setOpenWarranty] = useState(false);
  const [openMaintenance, setOpenMaintenance] = useState(false);

  const fetchCompany = async (companyId: any) => {
    try {
      const res = await companyApi.getById(companyId);
      setCompany(res);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin công ty:", error);
    }
  };

  useEffect(() => {
    if (product?.company_id) {
      fetchCompany(product.company_id);
    }
  }, [product]);

  const shortText =
    product?.description?.slice(0, 250) || "Sản phẩm không có mô tả.";
  const longText = product?.description;

  return (
    <Box mt={2} display="flex" flexDirection="column" gap={3}>
      {/* Mô tả sản phẩm */}
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
          Mô tả sản phẩm
        </Typography>

        <Box
          sx={{
            position: "relative",
            maxHeight: showFullDesc ? "none" : 200,
            overflow: "hidden",
            transition: "0.3s",
            "&::after": !showFullDesc
              ? {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "80px",
                  background:
                    "linear-gradient(to bottom, transparent, #fff 70%)",
                }
              : {},
          }}
        >
          <Typography
            whiteSpace="pre-line"
            sx={{
              color: "#444",
              fontSize: "16px",
              lineHeight: 1.8,
              textAlign: "justify",
            }}
          >
            {showFullDesc ? longText : shortText}
          </Typography>
        </Box>

        {/* Nút xem thêm */}
        {longText?.length > 250 && (
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              onClick={() => setShowFullDesc(!showFullDesc)}
              endIcon={showFullDesc ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                mt: 1,
                borderRadius: 3,
              }}
            >
              {showFullDesc ? "Thu gọn" : "Xem thêm"}
            </Button>
          </Box>
        )}
      </Box>

      {/* Chỉ hiển thị khi đã xem toàn bộ mô tả */}
      {showFullDesc && company && (
        <Box display="flex" flexDirection="column" gap={3}>
          {/* THÔNG TIN NHÀ SẢN XUẤT */}
          <Box
            sx={{
              background: "#fff",
              p: 3,
              borderRadius: 4,
              boxShadow: "0px 5px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="700"
              color="primary.main"
              mb={1}
            >
              Thông tin nhà sản xuất
            </Typography>

            <Typography fontSize="16px" fontWeight="600">
              Tên: {company.name}
            </Typography>
            <Typography mt={0.5} color="#555" fontSize="16px">
              Địa chỉ: {company.address}
            </Typography>
          </Box>

          {/* CHÍNH SÁCH BẢO HÀNH */}
          <Box
            sx={{
              background: "#fff",
              p: 3,
              borderRadius: 4,
              boxShadow: "0px 5px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="700" color="primary.main">
                Chính sách bảo hành
              </Typography>

              <IconButton onClick={() => setOpenWarranty(!openWarranty)}>
                {openWarranty ? <RemoveIcon /> : <AddIcon />}
              </IconButton>
            </Box>

            {openWarranty && (
              <Box display="flex" flexDirection="column" gap={2} mt={1}>
                {company.warranty_policy?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: "#f4f7ff",
                      p: 2,
                      borderRadius: 3,
                      borderLeft: "5px solid #2962ff",
                    }}
                  >
                    <Typography fontWeight={600} color="#333">
                      {item.category} – {item.duration_months} tháng
                    </Typography>
                    <Typography color="#555" fontSize="14px" mt={0.5}>
                      {item.details}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* LỊCH TRÌNH BẢO DƯỠNG */}
          <Box
            sx={{
              background: "#fff",
              p: 3,
              borderRadius: 4,
              boxShadow: "0px 5px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="700" color="primary.main">
                Lịch trình bảo dưỡng đề xuất
              </Typography>

              <IconButton onClick={() => setOpenMaintenance(!openMaintenance)}>
                {openMaintenance ? <RemoveIcon /> : <AddIcon />}
              </IconButton>
            </Box>

            {openMaintenance && (
              <Box display="flex" flexDirection="column" gap={2} mt={1}>
                {company.maintenance_policy?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: "#fafafa",
                      p: 2,
                      borderRadius: 3,
                      borderLeft: "5px solid #1976d2",
                    }}
                  >
                    <Typography
                      fontWeight="700"
                      color="primary.main"
                      minWidth={100}
                    >
                      {item.interval_months} tháng
                    </Typography>
                    <Typography color="#444">{item.task}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
