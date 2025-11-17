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

export default function MyOrders() {
  const [tab, setTab] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const LIMIT = 4;

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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
    setPage(1); // reset page khi đổi tab
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
        bgcolor: "#f5f5f5",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1280 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          sx={{ color: "#333" }}
        >
          🧾 Đơn hàng của bạn
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
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
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
              {/* Bảng chiếm hết chiều cao còn lại */}
              <Box sx={{ flexGrow: 1 }}>
                <Table sx={{ minWidth: 650 }} aria-label="orders table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Đơn hàng</TableCell>
                      <TableCell>Tổng tiền</TableCell>
                      <TableCell>Giảm giá</TableCell>
                      <TableCell>Ghi chú</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ngày tạo</TableCell>
                      <TableCell align="center">Hành động</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.order_id} hover>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>
                          {order.totalAmount.toLocaleString()} ₫
                        </TableCell>
                        <TableCell>
                          {order.discount_value
                            ? order.discount_value.toLocaleString() + " ₫"
                            : "-"}
                        </TableCell>
                        <TableCell>{order.note || "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.overallStatus}
                            color={
                              statusColors[order.overallStatus] || "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              navigate(`/orders/${order.order_id}`)
                            }
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {/* Pagination luôn cố định dưới */}
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
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
