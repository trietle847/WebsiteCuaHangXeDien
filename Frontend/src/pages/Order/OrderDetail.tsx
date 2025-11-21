import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  useMediaQuery,
  Stack,
  Grid
} from "@mui/material";
import orderApi from "../../services/order.api";
import { useParams } from "react-router-dom";
import FormatNumber from "../../helpper/FormatNumber";
import paymentApi from "../../services/payment.api";
import Breadcrumbs from "../../layouts/Breadcrumbs";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [momoData, setMomoData] = useState<{ payUrl: string } | null>(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const BASE_URL = "http://localhost:3000";

  const paymentStatusMap: Record<string, string> = {
    pending: "Chờ thanh toán",
    processing: "Đang xử lý",
    completed: "Đã thanh toán",
    failed: "Thanh toán thất bại",
  };

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
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;
    try {
      await orderApi.update(id, {
        delivery_status: "failed",
        payment_status: "failed",
      });
      fetchOrder();
      alert("Đã hủy đơn hàng thành công!");
    } catch (e) {
      console.error(e);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại!");
    }
  };

  const paymentHandle = async () => {
    const momoRes = await paymentApi.createMomoPayment(id);
    setMomoData({ payUrl: momoRes.payUrl });
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
    <Box>
      <Breadcrumbs
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Đơn hàng", path: "/orders" },
          { name: `Đơn hàng ${order.order_id}` },
        ]}
      />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          textAlign="center"
          sx={{ color: "#1976d2", fontWeight: 700, mb: 3 }}
        >
          Chi tiết đơn hàng #{order.order_id}
        </Typography>

        {/* Thông tin tóm tắt */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: "#f9f9f9",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin đơn hàng
          </Typography>

          <Grid container spacing={4} justifyContent={"center"}>
            {/* Đơn hàng */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontSize={18}
                fontWeight={600}
              >
                Đơn hàng
              </Typography>
              <Typography>Mã: #{order.order_id}</Typography>
              <Typography>
                Ngày đặt: {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Chip
                label={order.overallStatus}
                color="warning"
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Grid>

            {/* Khách hàng */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontSize={18}
                fontWeight={600}
              >
                Khách hàng
              </Typography>
              <Typography>{User.fullname}</Typography>
              <Typography>SĐT: {User.phone}</Typography>
              <Typography>Ghi chú: {order.note || "Không có"}</Typography>
            </Grid>

            {/* Thanh toán */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontSize={18}
                fontWeight={600}
              >
                Thanh toán
              </Typography>
              <Typography>
                {Payment.method === "cash" ? "Tiền mặt" : "Chuyển khoản"}
              </Typography>
              <Chip
                label={paymentStatusMap[Payment.status] || Payment.status}
                size="small"
                sx={{
                  fontWeight: 500,
                  mt: 0.5,
                  bgcolor:
                    Payment.status === "pending"
                      ? "#fbc02d"
                      : Payment.status === "processing"
                      ? "#42a5f5"
                      : Payment.status === "completed"
                      ? "#66bb6a"
                      : Payment.status === "failed"
                      ? "#ef5350"
                      : "#bdbdbd",
                  color: "#fff",
                }}
              />
            </Grid>

            {/* Giao hàng */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontSize={18}
                fontWeight={600}
              >
                Giao hàng
              </Typography>
              <Typography>
                {Delivery.method === "home_delivery"
                  ? "Giao tận nơi"
                  : "Nhận tại cửa hàng"}
              </Typography>
              <Typography>Người nhận: {Delivery.recipient_name}</Typography>
              <Typography>SĐT: {Delivery.recipient_phone}</Typography>
              <Typography>Địa chỉ: {Delivery.address || "Chưa có"}</Typography>
              <Typography>Phí: {FormatNumber(Delivery.cost)}đ</Typography>
            </Grid>

            {/* Khuyến mãi */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontSize={18}
                fontWeight={600}
              >
                Khuyến mãi
              </Typography>
              <Typography>Mã: {order.promotion_code || "Không có"}</Typography>
              <Typography>
                Giảm ngay: {FormatNumber(order.discount_value)} đ
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Danh sách sản phẩm */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Sản phẩm trong đơn hàng
        </Typography>
        {isMobile ? (
          <Stack spacing={2}>
            {OrderDetails.map((detail) => (
              <Paper key={detail.orderDetail_id} sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <img
                    src={
                      detail.ProductColor?.ColorImages?.length > 0
                        ? `${BASE_URL}${detail.ProductColor.ColorImages[0].url}`
                        : "/placeholder.png"
                    }
                    alt={detail.product_name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <Box flex={1}>
                    <Typography fontWeight={600}>
                      {detail.product_name}
                    </Typography>
                    <Typography>Màu: {detail.color_name}</Typography>
                    <Typography>Số lượng: {detail.quantity}</Typography>
                    <Typography>Giá: {FormatNumber(detail.price)} ₫</Typography>
                    <Typography>
                      Tổng: {FormatNumber(detail.total_price)} ₫
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <TableContainer
            sx={{ border: "1px solid #ddd", borderRadius: 1, mb: 3 }}
          >
            <Table>
              <TableHead
                sx={{ bgcolor: "#f0f2f5", "& th": { fontWeight: "bold" } }}
              >
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
                        }}
                      />
                    </TableCell>
                    <TableCell>{detail.product_name}</TableCell>
                    <TableCell>{detail.color_name}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>{FormatNumber(detail.price)} ₫</TableCell>
                    <TableCell>{FormatNumber(detail.total_price)} ₫</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tổng tiền */}
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#e8f5e9", mb: 3 }}>
          <Typography>
            Tổng tiền hàng:{" "}
            {FormatNumber(
              order.totalAmount + order.discount_value + Delivery.cost
            )}{" "}
            ₫
          </Typography>
          <Typography>
            Phí giao hàng: {FormatNumber(Delivery.cost)} ₫
          </Typography>
          <Typography>
            Khuyến mãi: {FormatNumber(order.discount_value)} ₫
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6" sx={{ color: "green" }}>
            Thành tiền:{" "}
            {FormatNumber(
              order.totalAmount
            )}{" "}
            ₫
          </Typography>
        </Paper>

        {/* Nút hành động */}
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          justifyContent="flex-end"
        >
          {order.overallStatus !== "Thất bại" &&
            order.overallStatus !== "Thành công" && (
              <Button onClick={cancelOrder} color="error" variant="outlined">
                Hủy đơn hàng
              </Button>
            )}
          {order.Payment.status !== "completed" &&
            order.Payment.method === "bank_transfer" && (
              <Button
                onClick={paymentHandle}
                variant="contained"
                color="primary"
              >
                Tiếp tục thanh toán
              </Button>
            )}
          {momoData && (
            <Button
              variant="contained"
              onClick={() => window.open(momoData.payUrl, "_blank")}
              sx={{ bgcolor: "#d81b60", "&:hover": { bgcolor: "#ad1457" } }}
            >
              Thanh toán Momo
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
