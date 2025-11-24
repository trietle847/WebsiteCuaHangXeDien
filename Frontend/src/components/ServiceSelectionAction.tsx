import { Avatar, Button, Typography, CircularProgress } from "@mui/material";
import { useSelectionState } from "../context/SelectionContext";
import { useReactToPrint } from "react-to-print";
import React, { useRef } from "react";
import { NumericFormat } from "react-number-format";
import {
  Box,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { ServiceTicket } from "../lib/types";

const ServicePrint = ({ service }: { service: ServiceTicket }) => {
  const details = service?.ServiceDetails || [];
  const mechanic = service?.Mechanic;
  const customer = service.Customer;
  const vehicle = service.Vehicle;
  const totalPrice =
    service.total_price || details.reduce((sum, acc) => (sum += Number(acc.price)), 0);

  return (
    <Box
      sx={{
        pageBreakAfter: "always",
        padding: 4,
        margin: "0 auto",
        maxWidth: "210mm",
        backgroundColor: "#fff",
        fontFamily: "'Arial', sans-serif",
        "@media print": {
          padding: "15mm",
          boxShadow: "none",
        },
      }}
    >
      {/* Header với Logo và Thông tin cửa hàng */}
      <Box>
        {/* Logo và thông tin cửa hàng */}
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                width: 150,
                height: 150,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Box
                component="img"
                src="/logo/logo_home.png"
                alt="Logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#1a237e",
                }}
              >
                CỬA HÀNG XE MÁY ĐIỆN EMOTOR
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.875rem", mb: 0.3 }}
              >
                Địa chỉ: Khu II, Đường 3/2, P.Xuân Khánh, Q.Ninh Kiều, TP. Cần
                Thơ
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                Điện thoại: 0123 456 789 - Email: contact@emotor.com
              </Typography>
            </Box>
          </Box>
          <Box></Box>
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1a237e",
                textAlign: "center",
              }}
            >
              PHIẾU {service.type === "maintenance" ? "BẢO DƯỠNG" : "SỬA CHỮA"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
              width: "100%",
            }}
          >
            <Typography variant="body1">
              Số: {service.serviceTicket_id}
            </Typography>
            <Typography variant="body1">
              Ngày lập:{" "}
              {new Date().toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Thông tin khách hàng */}
      <Box
        sx={{
          my: 2,
          p: 1,
          backgroundColor: "#f8f9fa",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "#1a237e" }}
        >
          Thông tin khách hàng
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, p: 2 }}>
          <Typography variant="body2">
            <strong>Khách hàng:</strong>{" "}
            {`${customer?.last_name || ""} ${customer?.first_name || ""}`}
          </Typography>
          <Typography variant="body2">
            <strong>Số ĐT:</strong> {customer?.phone}
          </Typography>
          <Typography variant="body2">
            <strong>Xe:</strong> {vehicle?.ProductColor?.Product.name} {""}
            {vehicle?.ProductColor?.Color.name}
          </Typography>
          <Typography variant="body2">
            <strong>Số khung:</strong> {vehicle?.vin}
          </Typography>
        </Box>
      </Box>

      {/* Bảng dịch vụ */}
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: 700, mb: 1, color: "#1a237e" }}
        >
          Thông tin dịch vụ
        </Typography>
        <Typography variant="body2">
          <strong>Kỹ thuật viên:</strong>
          {""}
          {mechanic? `${mechanic?.last_name || ""} ${mechanic?.first_name || ""}`: ".".repeat(50)}
        </Typography>
        <Typography variant="body2">
          <strong>Số km khi tiếp nhận:</strong>
          {""}
          {service.mileage_at_check_in||".".repeat(20)} km
        </Typography>
        <TableContainer sx={{ my: 2 }}>
          <Table
            sx={{
              "& .MuiTableCell-root": {
                border: "1px solid #e0e0e0",
                padding: "8px 12px",
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#667eea" }}>
                <TableCell align="center">STT</TableCell>
                <TableCell>Nội dung dịch vụ</TableCell>
                <TableCell align="right">Phí dịch vụ</TableCell>
                <TableCell align="right">Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{item.content}</TableCell>
                  <TableCell align="right">
                    {Math.round(item.price) === 0 ? (
                      "Miễn phí"
                    ) : (
                      <NumericFormat
                        value={item.price}
                        displayType="text"
                        thousandSeparator="."
                        decimalSeparator=","
                        suffix=" đ"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">{item.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Tổng tiền */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Box sx={{ width: "350px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 0.8,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body1">Tổng tiền:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                <NumericFormat
                  value={totalPrice}
                  displayType="text"
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                />
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 2, borderTop: "1px dashed #ccc" }}>
        {service.description && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Ghi chú:</strong> {service.description}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            textAlign: "center",
            mt: 3,
            color: "#666",
          }}
        >
          Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ tại EMOTOR!
        </Typography>
      </Box>
    </Box>
  );
};

const AllServicesPrint = React.forwardRef<HTMLDivElement, { services: ServiceTicket[] }>(
  ({ services }, ref) => {
    return (
      <Box ref={ref}>
        {services.map((service) => (
          <ServicePrint key={service.serviceTicket_id} service={service} />
        ))}
      </Box>
    );
  }
);

export default function ServiceSelectionActions() {
  const { selectedData } = useSelectionState();
  const [isPreparing, setIsPreparing] = React.useState(false);

  const componentRef = useRef(null);

  const handlePrintClick = () => {
    setIsPreparing(true);
    // Sử dụng startTransition để render không chặn UI
    React.startTransition(() => {
      // Đợi React render xong nội dung in
      setTimeout(() => {
        handlePrint();
      }, 100);
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Hóa_đơn_${new Date().toISOString()}`,
    onAfterPrint: () => {
      // Dọn dẹp sau khi in xong
      setIsPreparing(false);
    },
    pageStyle: `
      @page {
        size: A4;
        /* Đặt lề trang giấy về 0 */
        margin: 0mm; 
        /* Ẩn header (tiêu đề, ngày giờ) */
        @top-left {
          content: "";
        }
        @top-center {
          content: "";
        }
        @top-right {
          content: "";
        }

        @bottom-left {
          content: "";
        }
        @bottom-center {
          content: "";
        }
        @bottom-right {
          content: "";
        }
 }
    `,
  });

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrintClick}
        disabled={selectedData.length === 0 || isPreparing}
        startIcon={
          isPreparing ? (
            <CircularProgress size={20} color="inherit" />
          ) : undefined
        }
      >
        {isPreparing
          ? "Đang chuẩn bị..."
          : `In ${
              selectedData.length > 0 ? `${selectedData.length} ` : ""
            }phiếu dịch vụ`}
      </Button>
      {/* Chỉ render khi đang chuẩn bị in */}
      {isPreparing && (
        <Box sx={{ display: "none" }}>
          <AllServicesPrint ref={componentRef} services={selectedData} />
        </Box>
      )}
    </Box>
  );
}
