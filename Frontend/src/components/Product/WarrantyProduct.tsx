import { useEffect, useState } from "react";
import { Box, Typography, } from "@mui/material";
import companyApi from "../../services/company.api";

export default function WarrantyProduct({ product }: any) {
  const [company, setCompany] = useState<any>(null);

  const fetchCompany = async (companyId: any) => {
    try {
      const res = await companyApi.getById(companyId);
      setCompany(res);
      console.log(res);
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
    <Box>
      <Box
        sx={{
          background: "#fff",
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          boxShadow: "0px 5px 25px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            transition: "0.3s",
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
            Thông tin bảo hành
          </Typography>

          {company && (
            <>
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
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
