import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
} from "@mui/material";
import orderApi from "../../services/order.api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:3000";
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const res = await orderApi.getOrderByIdAndUser(id);
      setOrder(res.data);
    } catch (e) {
      console.error("Lỗi lấy chi tiết đơn hàng:", e);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Bạn có chắc muốn hủy đơn hàng này không?"
    );
    if (!confirmCancel) return;

    try {
      await orderApi.update(id, {
        delivery_status: "failed",
        payment_status: "failed",
      });
      fetchOrder();
      alert("Đã hủy đơn hàng thành công!");
    } catch (e) {
      console.error("Lỗi hủy đơn hàng:", e);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Đang tải dữ liệu đơn hàng...</Typography>
      </Box>
    );

  if (!order)
    return (
      <Typography textAlign="center" mt={4}>
        Không tìm thấy đơn hàng.
      </Typography>
    );

  const { Delivery, Payment, User, OrderDetails } = order;

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 1100,
        margin: "0 auto",
        backgroundColor: "#fafafa",
      }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "white",
          border: "1px solid #ddd",
        }}
      >
        {/* Nút quay lại */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            cursor: "pointer",
            width: "fit-content",
            "&:hover": { color: "primary.dark" },
          }}
          onClick={() => navigate("/orders")}
        >
          <ArrowBack sx={{ mr: 1, color: "primary.main" }} />
          <Typography color="primary.main" fontWeight={500}>
            Quay lại danh sách đơn hàng
          </Typography>
        </Box>
        {/* Tiêu đề */}
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          color="primary"
        >
          Chi tiết đơn hàng
        </Typography>
        <Divider sx={{ my: 3 }} />
        {/* Thông tin đơn hàng */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            mb: 3,
          }}
        >
          {/* Đơn hàng */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography color="primary" fontWeight={500}>
              Đơn hàng:
            </Typography>
            <Typography>Mã #{order.order_id}</Typography>
            <Typography>
              | Ngày đặt: {new Date(order.createdAt).toLocaleString()}
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              | Trạng thái:{" "}
              <Chip label={order.overallStatus} color="warning" size="small" />
            </Typography>
          </Box>

          {/* Khách hàng */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography color="primary" fontWeight={500}>
              Khách hàng:
            </Typography>
            <Typography>{User.fullname}</Typography>
            <Typography>| SĐT: {User.phone}</Typography>
            <Typography>| Ghi chú: {order.note || "Không có"}</Typography>
          </Box>

          {/* Thanh toán */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography color="primary" fontWeight={500}>
              Thanh toán:
            </Typography>
            <Typography>
              {Payment.method === "cash" ? "Tiền mặt" : Payment.method}
            </Typography>
            <Typography>
              | Trạng thái:{" "}
              <Chip label={Payment.status} color="secondary" size="small" />
            </Typography>
          </Box>

          {/* Giao hàng */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography color="primary" fontWeight={500}>
              Giao hàng:
            </Typography>
            <Typography>
              {Delivery.method === "home_delivery"
                ? "Giao tận nơi"
                : "Nhận tại cửa hàng"}
            </Typography>
            <Typography>| Người nhận: {Delivery.recipient_name}</Typography>
            <Typography>| SĐT: {Delivery.recipient_phone}</Typography>
            <Typography>| Địa chỉ: {Delivery.address}</Typography>
            <Typography>| Phí: {Delivery.cost.toLocaleString()}₫</Typography>
          </Box>
        </Box>
        {/* Danh sách sản phẩm */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ borderBottom: "2px solid #ccc", pb: 1 }}
        >
          🛵 Danh sách sản phẩm
        </Typography>
        <TableContainer
          sx={{ border: "1px solid #ddd", borderRadius: 1, mb: 3 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Màu sắc</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giá tiền</TableCell>
                <TableCell>Tổng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {OrderDetails.map((detail) => (
                <TableRow key={detail.orderDetail_id}>
                  <TableCell>
                    <img
                      src={
                        detail.ProductColor?.ColorImages?.length > 0
                          ? `${BASE_URL}${detail.ProductColor.ColorImages[0].url}`
                          : "/placeholder.png"
                      }
                      alt={detail.product_name}
                      style={{
                        width: 70,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Typography>{detail.product_name}</Typography>
                  </TableCell>
                  <TableCell>{detail.color_name}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>{detail.price.toLocaleString()} ₫</TableCell>
                  <TableCell>{detail.total_price.toLocaleString()} ₫</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Tổng cộng */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: "right", lineHeight: 1.8 }}>
          <Typography>
            Tổng tiền hàng:{" "}
            {(order.totalAmount - (Delivery?.cost || 0)).toLocaleString()}₫
          </Typography>
          <Typography>
            Phí giao hàng: {Delivery.cost.toLocaleString()}₫
          </Typography>
          <Typography variant="h6" sx={{ color: "green", mt: 1 }}>
            Thành tiền: {order.totalAmount.toLocaleString()}₫
          </Typography>
        </Box>
        {order.overallStatus !== "Thất bại" &&
          order.overallStatus !== "Hoàn thành" && (
            <Box sx={{ textAlign: "right", mt: 4 }}>
              <Button
                onClick={() => {
                  cancelOrder();
                }}
              >
                <Typography>Hủy đơn hàng</Typography>
              </Button>
            </Box>
          )}{" "}
      </Paper>
    </Box>
  );
}
