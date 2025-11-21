import type { EntityConfig } from "./types";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import orderApi from "../../../services/order.api";
import { NumericFormat } from "react-number-format";
import { Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Tooltip,
  IconButton,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableRow,
  Divider,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import OrderForm from "../../../components/form/Order/OrderForm";
import type { OrderDetail, Delivery, Payment } from "../../types";
import { Controller, useFormContext } from "react-hook-form";
import { memo } from "react";
import OrderSelectionActions from "../../../components/OrderSelectionActions";
import { useForm } from "react-hook-form";

const deliveryFlow = {
  processing: ["ready", "shipping", "delivered", "failed"],
  ready: ["shipping", "delivered", "failed"],
  shipping: ["delivered", "failed"],
  delivered: [],
  failed: [],
};

const deliveryLabels = {
  processing: "Đang xử lý",
  ready: "Sẵn sàng nhận hàng",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
  failed: "Giao hàng thất bại",
};

function StatusSelect({
  deliveryStatus,
  paymentStatus,
}: {
  deliveryStatus: string;
  paymentStatus: string;
}) {
  const { control } = useFormContext();
  return (
    <Box>
      {(deliveryStatus !== "delivered" || paymentStatus !== "completed") && (
        <Box>
          <Typography variant="subtitle1">Trạng thái giao hàng</Typography>
          <Controller
            name="delivery_status"
            control={control}
            defaultValue={deliveryStatus}
            render={({ field }) => (
              <Select {...field} fullWidth>
                <MenuItem disabled value={deliveryStatus}>
                  {
                    deliveryLabels[
                      deliveryStatus as keyof typeof deliveryLabels
                    ]
                  }{" "}
                  (hiện tại)
                </MenuItem>
                {deliveryFlow[deliveryStatus as keyof typeof deliveryFlow].map(
                  (status) => (
                    <MenuItem key={status} value={status}>
                      {deliveryLabels[status as keyof typeof deliveryLabels]}
                    </MenuItem>
                  )
                )}
              </Select>
            )}
          />
        </Box>
      )}
      {(paymentStatus === "pending" || paymentStatus === "processing") && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Trạng thái thanh toán</Typography>
          <Controller
            name="payment_status"
            control={control}
            defaultValue={paymentStatus}
            render={({ field }) => (
              <Select {...field} fullWidth>
                {paymentStatus === "pending" && (
                  <MenuItem disabled value={"pending"}>
                    Chờ thanh toán
                  </MenuItem>
                )}
                {paymentStatus === "processing" && (
                  <MenuItem disabled value={"processing"}>
                    Đang xử lý
                  </MenuItem>
                )}
                <MenuItem value="completed">Đã thanh toán</MenuItem>
                <MenuItem value="failed">Thanh toán thất bại</MenuItem>
              </Select>
            )}
          />
        </Box>
      )}
    </Box>
  );
}

const MemoizedDetailContent = memo(({ row }: { row: any }) => {
  const details: OrderDetail[] = row.OrderDetails;
  const delivery: Delivery = row.Delivery;
  const payment: Payment = row.Payment;

  return (
    <Box>
      <strong>Thông tin giao hàng:</strong>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 2,
        }}
      >
        <p>Người nhận: {delivery.recipient_name}</p>
        <p>Số điện thoại: {delivery.recipient_phone}</p>
        <p>
          Phương thức:{" "}
          {delivery.method === "at_store"
            ? "Nhận tại cửa hàng"
            : "Giao hàng tận nơi"}
        </p>
        <p>
          Trạng thái:{" "}
          {(() => {
            switch (delivery.status) {
              case "processing":
                return "Đang xử lý";
              case "ready":
                return "Chờ nhận hàng";
              case "shipping":
                return "Đang giao hàng";
              case "delivered":
                return "Đã giao hàng";
              case "failed":
                return "Giao hàng thất bại";
              default:
                return delivery.status;
            }
          })()}
        </p>
        {delivery.method === "home_delivery" && (
          <p>Địa chỉ: {delivery.address}</p>
        )}
        {delivery.method === "home_delivery" && (
          <p>
            Phí giao hàng:{" "}
            <NumericFormat
              value={delivery.cost}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              suffix=" đ"
            />
          </p>
        )}
      </Box>
      <Divider sx={{ mt: 1 }} />
      <strong>Thông tin thanh toán:</strong>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <p>
          Phương thức: {payment.method === "cash" ? "Tiền mặt" : "Chuyển khoản"}
        </p>
        <p>
          Trạng thái:{" "}
          {(() => {
            switch (payment.status) {
              case "pending":
                return "Chờ xử lý";
              case "completed":
                return "Đã thanh toán";
              case "failed":
                return "Thanh toán thất bại";
              default:
                return payment.status;
            }
          })()}
        </p>
        {payment.paid_at && (
          <p>
            Ngày thanh toán:{" "}
            {new Date(payment.paid_at).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        )}
      </Box>
      <Divider sx={{ mt: 1 }} />
      <strong>Danh sách sản phẩm:</strong>
      <TableContainer sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {`${item.product_name} (${item.color_name})`}
                </TableCell>
                <TableCell>
                  <NumericFormat
                    value={item.price}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix=" đ"
                  />
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
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
          <TableFooter>
            <TableRow>
              <TableCell sx={{ textAlign: "right" }} colSpan={3}>
                Tổng cộng:
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {row.promotion_code && (
        <Box>
          <span>
            Mã khuyến mãi: {row.promotion_code} - Giảm:{" "}
            <NumericFormat
              value={row.discount_value}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              suffix=" đ"
            />
          </span>
          <br />
        </Box>
      )}
      <strong>
        Tổng trị giá:{" "}
        <NumericFormat
          value={row.totalAmount}
          displayType="text"
          thousandSeparator="."
          decimalSeparator=","
          suffix=" đ"
        />
      </strong>
    </Box>
  );
});

export const orderConfig: EntityConfig = {
  idKey: "order_id",
  name: "orders",
  label: "Đơn hàng",
  permission: {
    create: true,
    update: true,
    delete: false,
  },
  selectContent: () => <OrderSelectionActions />,
  getColumns: (actions) => [
    {
      field: "order_id",
      headerName: "Mã đơn hàng",
      width: 150,
    },
    {
      field: "User.fullname",
      headerName: "Khách hàng",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <span>
          {params.row.User ? params.row.User.fullname : "Khách vãng lai"}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày đặt",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <span>
          {new Date(params.value as string).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          ,{" "}
          {new Date(params.value as string).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <NumericFormat
          value={params.value}
          displayType="text"
          thousandSeparator="."
          decimalSeparator=","
          suffix=" đ"
        />
      ),
    },
    {
      field: "overallStatus",
      headerName: "Trạng thái đơn hàng",
      width: 200,
    },
    {
      field: "detail",
      headerName: "Chi tiết đơn hàng",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Tooltip title={"Xem chi tiết"}>
            <IconButton
              sx={{
                color: "primary.main",
                "&:hover": {
                  color: "green",
                },
              }}
              onClick={() => {
                if (actions?.onView) {
                  actions.onView({
                    title: "Chi tiết đơn hàng",
                    content: <MemoizedDetailContent row={params.row} />,
                  });
                }
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const methods = useForm();
        if (["Thành công", "Thất bại"].includes(params.row.overallStatus))
          return null;
        return (
          <Tooltip title={"Cập nhật trạng thái đơn hàng"}>
            <IconButton
              onClick={() => {
                if (actions?.onView) {
                  actions.onView({
                    title: "Cập nhật trạng thái đơn hàng",
                    content: (
                      <StatusSelect
                        deliveryStatus={params.row.Delivery.status}
                        paymentStatus={params.row.Payment.status}
                      />
                    ),
                    quickUpdate: async (id: number, data: any) => {
                      return await orderApi.update(id, data);
                    },
                    id: params.row.order_id,
                    formMethods: methods,
                  });
                }
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ],
  api: orderApi,
  customFormComponents: () => <OrderForm />,
};
