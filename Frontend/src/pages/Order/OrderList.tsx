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
} from "@mui/material";
import orderApi from "../../services/order.api";
import { useNavigate } from "react-router-dom";
import FormatNumber from "../../helpper/FormatNumber";
import promotionApi from "../../services/promotion.api";

export default function MyOrders() {
  const [tab, setTab] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const LIMIT = 5;

  // Bản đồ trạng thái tổng thể (Delivery + Payment)
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
    "Thất bại": "error",
  };

  const paymentStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Chờ thanh toán", color: "#fbc02d" },
    processing: { label: "Đang xử lý", color: "#42a5f5" },
    completed: { label: "Đã thanh toán", color: "#66bb6a" },
    failed: { label: "Thanh toán thất bại", color: "#ef5350" },
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
    setPage(1);
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
      console.log(res.data);
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
          sx={{ mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Tất cả" value="all" />
          <Tab label="Chờ xử lý" value="Chờ xử lý" />
          <Tab label="Sẵn sàng" value="Sẵn sàng" />
          <Tab label="Đang vận chuyển" value="Đang vận chuyển" />
          <Tab label="Đã giao" value="Đã giao" />
          <Tab label="Giao thất bại" value="Thất bại" />
        </Tabs>

        <Paper
          sx={{
            borderRadius: 3,
            p: 2,
            bgcolor: "#fff",
            minHeight: 400,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {loading ? (
            <Typography align="center" sx={{ py: 10 }}>
              Đang tải đơn hàng...
            </Typography>
          ) : orders.length === 0 ? (
            <Typography align="center" sx={{ py: 10 }}>
              Không có đơn hàng
            </Typography>
          ) : (
            <>
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
                      <TableCell align="center" sx={{ fontWeight: 500 }}>
                        #{order.order_id}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {FormatNumber(order.totalAmount)} đ
                      </TableCell>
                      <TableCell align="right">
                        {order.promotion_code ? order.promotion_code : null}
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

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
