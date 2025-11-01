import React from "react";
import { Typography, Box } from "@mui/material";

export default function OrdersSection({ orders }) {
  return (
    <>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Đơn hàng của bạn
      </Typography>
      {orders.map((order) => (
        <Box key={order.id} sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Typography>
            <strong>Mã đơn:</strong> {order.id}
          </Typography>
          <Typography>
            Ngày: {order.date} | Tổng: {order.total} | Trạng thái:{" "}
            {order.status}
          </Typography>
        </Box>
      ))}
    </>
  );
}
