import { useEffect, useState } from "react";
import { Box, Typography, } from "@mui/material";
import companyApi from "../../services/company.api";

export default function Description({ product }: any) {
  const [company, setCompany] = useState<any>(null);

  const fetchCompany = async (companyId: any) => {
    try {
      const res = await companyApi.getById(companyId);
      setCompany(res);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin công ty:", error);
    }
  };

  useEffect(() => {
    if (product.company_id) {
      fetchCompany(product.company_id);
    }
  }, [product]);

  return (
    <Box >
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
            overflow: "hidden",
            transition: "0.3s",
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
            {product.description}
          </Typography>
          <Typography
            variant="h6"
            fontWeight="700"
            color="primary.main"
            gutterBottom
            sx={{
              fontSize: { xs: "18px", md: "20px" },
              mb: 1.5,
              mt: 2,
            }}
          >
            Nhà sản xuất
          </Typography>

          {company && (
            <>
              <Typography
                whiteSpace="pre-line"
                sx={{
                  color: "#000",
                  fontSize: "16px",
                  lineHeight: 1.8,
                  textAlign: "justify",
                }}
              >
                Tên nhà sản xuất: {company.name}
              </Typography>

              <Typography
                whiteSpace="pre-line"
                sx={{
                  color: "#000",
                  fontSize: "16px",
                  lineHeight: 1.8,
                  textAlign: "justify",
                }}
              >
                Địa chỉ: {company.address}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
