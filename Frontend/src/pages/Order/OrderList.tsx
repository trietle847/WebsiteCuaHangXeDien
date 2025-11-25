import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Pagination,
  Button,
  CircularProgress,
  useMediaQuery,
  Stack,
} from "@mui/material";
import orderApi from "../../services/order.api";
import { useNavigate } from "react-router-dom";
import FormatNumber from "../../helpper/FormatNumber";

export default function MyOrders() {
  const [tab, setTab] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const LIMIT = 4;
  const isMobile = useMediaQuery("(max-width:768px)");

  const statusMap: Record<string, string> = {
    all: "",
    "Chờ xử lý": "processing",
    "Sẵn sàng": "ready",
    "Đang vận chuyển": "shipping",
    "Đã giao": "delivered",
    "Thất bại": "failed",
  };

  const statusColors: Record<
    string,
    "default" | "primary" | "success" | "warning" | "error" | "info"
  > = {
    "Chờ xử lý": "warning",
    "Sẵn sàng": "primary",
    "Đang vận chuyển": "info",
    "Đã giao": "success",
    "Thành công": "success",
    "Thất bại": "error",
  };

  const paymentStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Chờ thanh toán", color: "#fbc02d" },
    processing: { label: "Đang xử lý", color: "#42a5f5" },
    completed: { label: "Đã thanh toán", color: "#429a46ff" },
    failed: { label: "Thanh toán thất bại", color: "#ef5350" },
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getByUser({
        status: statusMap[tab] || undefined,
        page,
        limit: LIMIT,
      });
      setOrders(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab, page]);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
    setPage(1);
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderOrderCard = (order: any) => (
    <Paper
      key={order.order_id}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        "&:hover": { boxShadow: "0 6px 25px rgba(0,0,0,0.08)" },
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          #{order.order_id} - {FormatNumber(order.totalAmount)} đ
        </Typography>
        <Typography variant="body2">
          Mã giảm giá: {order.promotion_code || "-"}
        </Typography>
        <Typography variant="body2">Ghi chú: {order.note || "-"}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={order.overallStatus}
            color={statusColors[order.overallStatus] || "default"}
            size="small"
            sx={{ fontWeight: 500 }}
          />
          {order.Payment?.status && (
            <Chip
              label={paymentStatusMap[order.Payment.status]?.label}
              size="small"
              sx={{
                fontWeight: 500,
                bgcolor:
                  paymentStatusMap[order.Payment.status]?.color || "#bdbdbd",
                color: "#fff",
              }}
            />
          )}
        </Stack>
        <Typography variant="caption">
          Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/orders/${order.order_id}`)}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 500 }}
        >
          Xem chi tiết
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        bgcolor: "#f5f6fa",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1280 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          sx={{ color: "#333", textTransform: "uppercase" }}
        >
          Đơn hàng của bạn
        </Typography>

        <Tabs
          value={tab}
          onChange={handleChangeTab}
          sx={{
            mb: 3,
            minHeight: 48,
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
        >
          {[
            "all",
            "Chờ xử lý",
            "Sẵn sàng",
            "Đang vận chuyển",
            "Đã giao",
            "Thất bại",
          ].map((value) => {
            const labelMap: Record<string, string> = {
              all: "Tất cả",
              "Chờ xử lý": "Chờ xử lý",
              "Sẵn sàng": "Sẵn sàng",
              "Đang vận chuyển": "Đang vận chuyển",
              "Đã giao": "Đã giao",
              "Thất bại": "Giao thất bại",
            };
            const isActive = tab === value;
            return (
              <Tab
                key={value}
                label={labelMap[value]}
                value={value}
                sx={{
                  textTransform: "none",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#1976d2" : "#555",
                  borderRadius: 2,
                  px: 2,
                  mx: 0.5,
                  minHeight: 36,
                  transition: "all 0.3s ease",
                  bgcolor: isActive ? "rgba(25, 118, 210, 0.1)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
              />
            );
          })}
        </Tabs>

        <Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : orders.length === 0 ? (
            <Typography align="center" sx={{ py: 10 }}>
              Không có đơn hàng
            </Typography>
          ) : isMobile ? (
            // Mobile: Card view
            <Box>{orders.map(renderOrderCard)}</Box>
          ) : (
            // Desktop: Table view
            <Paper
              sx={{
                borderRadius: 3,
                p: 2,
                bgcolor: "#fff",
                minHeight: 400,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Table sx={{ minWidth: 700 }} aria-label="orders table">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#f0f2f5",
                      "& th": {
                        fontWeight: "bold",
                        color: "#333",
                        textTransform: "uppercase",
                      },
                    }}
                  >
                    <TableCell align="center">Mã đơn hàng</TableCell>
                    <TableCell align="right">Tổng tiền</TableCell>
                    <TableCell align="right">Mã giảm giá</TableCell>
                    <TableCell>Ghi chú</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell align="center">Thanh toán</TableCell>
                    <TableCell align="center">Ngày tạo</TableCell>
                    <TableCell align="center">Hành động</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.order_id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#fafafa" },
                        transition: "0.2s ease",
                      }}
                    >
                      <TableCell align="center">#{order.order_id}</TableCell>
                      <TableCell align="right">
                        {FormatNumber(order.totalAmount)} đ
                      </TableCell>
                      <TableCell align="right">
                        {order.promotion_code || "-"}
                      </TableCell>
                      <TableCell>{order.note || "-"}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={order.overallStatus}
                          color={statusColors[order.overallStatus] || "default"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {order.Payment?.status ? (
                          <Chip
                            label={
                              paymentStatusMap[order.Payment.status]?.label
                            }
                            size="small"
                            sx={{
                              fontWeight: 500,
                              bgcolor:
                                paymentStatusMap[order.Payment.status]?.color ||
                                "#bdbdbd",
                              color: "#fff",
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/orders/${order.order_id}`)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontWeight: 500,
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
