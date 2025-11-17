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
import type { Order, OrderDetail, Delivery, Payment } from "../lib/types";

const InvoicePrint = ({ order }: { order: Order }) => {
  const details: OrderDetail[] = order.OrderDetails;
  const delivery: Delivery = order.Delivery;
  const payment: Payment = order.Payment;

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
      <Box sx={{}}>
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
              HÓA ĐƠN BÁN HÀNG
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
            <Typography variant="body1">Số: {order.order_id}</Typography>
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
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 1 }}>
          <Typography variant="body2">
            <strong>Khách hàng:</strong>{" "}
            {order.User?.fullname || delivery.recipient_name}
          </Typography>
          <Typography variant="body2">
            <strong>Số ĐT:</strong> {delivery.recipient_phone}
          </Typography>
          <Typography variant="body2">
            <strong>Địa chỉ:</strong> {delivery.address || "CTU"}
          </Typography>
        </Box>
      </Box>

      {/* Bảng sản phẩm */}
      <TableContainer sx={{ mb: 3 }}>
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
              <TableCell>Sản phẩm</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>{`${item.product_name} (${item.color_name})`}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  <NumericFormat
                    value={item.price}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix=" đ"
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  <NumericFormat
                    value={item.total_price}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix=" đ"
                  />
                </TableCell>
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
            <Typography variant="body1">Tạm tính:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              <NumericFormat
                value={details.reduce(
                  (total, item) => total + item.total_price,
                  0
                )}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 0.8,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body1">Phí vận chuyển:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              <NumericFormat
                value={delivery.cost || 0}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 0.8,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body1">Giảm giá:</Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#f44336" }}
            >
              <NumericFormat
                value={order.discount_value || 0}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 1.5,
              backgroundColor: "#667eea",
              px: 2,
              mt: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Tổng cộng:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              <NumericFormat
                value={order.totalAmount}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 2, borderTop: "1px dashed #ccc" }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Phương thức thanh toán:</strong>{" "}
          {payment.method === "cash" ? "Tiền mặt" : "Chuyển khoản"}
        </Typography>
        {order.note && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Ghi chú:</strong> {order.note}
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
          Cảm ơn quý khách đã mua hàng tại EMOTOR!
        </Typography>
      </Box>
    </Box>
  );
};

const AllInvoicesPrint = React.forwardRef<HTMLDivElement, { orders: Order[] }>(
  ({ orders }, ref) => {
    return (
      <Box ref={ref}>
        {orders.map((order) => (
          <InvoicePrint key={order.order_id} order={order} />
        ))}
      </Box>
    );
  }
);

export default function OrderSelectionActions() {
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
            }hóa đơn`}
      </Button>
      {/* Chỉ render khi đang chuẩn bị in */}
      {isPreparing && (
        <Box sx={{ display: "none" }}>
          <AllInvoicesPrint ref={componentRef} orders={selectedData} />
        </Box>
      )}
    </Box>
  );
}
