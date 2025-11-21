import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import paymentApi from "../../services/payment.api";
import orderApi from "../../services/order.api";
import FormatNumber from "../../helpper/FormatNumber";

export default function PaymentHandle() {
  const [searchParams] = useSearchParams();
  const payload = Object.fromEntries([...searchParams]);
  const isMomo = payload.orderType === "momo_wallet";

  const { data, isLoading, error } = useQuery({
    queryKey: ["handleMomoIPN", payload],
    queryFn: () => paymentApi.handleMomoIPN(payload),
    enabled: isMomo,
  });

  const isSuccess = payload.resultCode === "0";
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getById(payload.orderId);
        console.log(res.data);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin đơn hàng", err);
      }
    };
    if (!isMomo || data) fetchOrder();
  }, [data, isMomo, payload.orderId]);

  const getFullUrl = (url: string) =>
    url?.startsWith("http") ? url : `http://localhost:3000${url}`;

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        backgroundColor: "#f9fafb",
      }}
    >
      <Card
        sx={{
          maxWidth: 1200,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {isLoading && (
            <Box textAlign="center" py={5}>
              <CircularProgress />
              <Typography mt={2}>Đang xử lý thanh toán...</Typography>
            </Box>
          )}

          {error && (
            <Box textAlign="center" py={5}>
              <ErrorIcon sx={{ color: "error.main", fontSize: 80 }} />
              <Typography mt={2} color="error">
                {(error as Error).message}
              </Typography>
            </Box>
          )}

          { order && (
            <>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                  <CheckCircle sx={{ fontSize: 80, color: "success.main" }} />

                <Typography variant="h4" fontWeight={700} mt={2}>
                  Cảm ơn bạn đã đặt hàng
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "#eee",
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      Thông tin mua hàng
                    </Typography>

                    <Typography>
                      <b>Họ tên:</b> {order.Delivery.recipient_name}
                    </Typography>
                    <Typography>
                      <b>SĐT:</b> {order.Delivery.recipient_phone}
                    </Typography>

                    <Box mt={2}>
                      <Typography variant="h6" fontWeight={700} mb={1}>
                        Phương thức thanh toán
                      </Typography>

                      <Typography>
                        {order.Payment.method === "bank_transfer"
                          ? "Chuyển khoản"
                          : "Tiền mặt khi nhận hàng"}
                      </Typography>

                      {order.Payment.method === "bank_transfer" && (
                        <Typography
                          sx={{
                            fontWeight: 700,
                            mt: 1,
                            color: isSuccess ? "green" : "red",
                          }}
                        >
                          Trạng thái:{" "}
                          {isSuccess ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      Địa chỉ nhận hàng
                    </Typography>
                    <Typography>{order.Delivery.address}</Typography>

                    <Typography variant="h6" fontWeight={700} mt={2}>
                      Phương thức vận chuyển
                    </Typography>
                    <Typography>
                      {order.Delivery.method === "at_store"
                        ? "Nhận tại cửa hàng"
                        : "Giao hàng tận nơi"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box sx={{ borderBottom: "1px solid #ccc" }}>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      Đơn hàng #{payload.orderId}
                    </Typography>
                  </Box>

                  {order.OrderDetails.map((item: any) => {
                    const image = getFullUrl(
                      item.ProductColor?.ColorImages?.[0]?.url ||
                        "/no-image.png"
                    );

                    return (
                      <Box
                        key={item.orderDetail_id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <img
                          src={image}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            objectFit: "cover",
                          }}
                        />

                        <Box sx={{ flexGrow: 1, mx: 2 }}>
                          <Typography fontWeight={600}>
                            {item.product_name}
                          </Typography>
                          <Typography variant="body2" color="gray">
                            Màu: {item.color_name}
                          </Typography>
                          <Typography variant="body2" color="gray">
                            SL: {item.quantity}
                          </Typography>
                        </Box>

                        <Typography fontWeight={700}>
                          {FormatNumber(item.total_price || item.price)} đ
                        </Typography>
                      </Box>
                    );
                  })}

                  <Box textAlign="right" mt={3}>
                    {order.discount_value > 0 && (
                      <Typography fontWeight={500}>
                        Khuyến mãi: -{FormatNumber(order.discount_value)} đ
                      </Typography>
                    )}

                    <Typography fontWeight={500}>
                      Phí vận chuyển: {FormatNumber(order.Delivery.cost)} đ
                    </Typography>

                    <Box sx={{ borderTop: "1px solid #ccc", mt: 2 }}>
                      <Typography variant="h6" fontWeight={700} mt={1}>
                        Tổng cộng: {FormatNumber(order.totalAmount)} đ
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Button variant="contained" component={Link} to="/products">
                  Tiếp tục mua hàng
                </Button>
                <Button variant="outlined" component={Link} to="/orders">
                  Xem đơn hàng
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
