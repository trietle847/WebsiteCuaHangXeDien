import type { EntityConfig } from "./types";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import orderApi from "../../../services/order.api";
import { NumericFormat } from "react-number-format";
import { Visibility } from "@mui/icons-material";
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
} from "@mui/material";
import OrderForm from "../../../components/form/Order/OrderForm";
import type { OrderDetail, Delivery, Payment } from "../../types";

export const orderConfig: EntityConfig = {
  idKey: "order_id",
  name: "orders",
  label: "Đơn hàng",
  permission: {
    create: true,
    update: true,
    delete: false,
  },
  getColumns: (actions) => [
    {
      field: "order_id",
      headerName: "Mã đơn hàng",
      flex: 1,
    },
    {
      field: "User.fullname",
      headerName: "Khách hàng",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <span>
          {params.row.User ? params.row.User.fullname : "Khách vãng lai"}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày đặt",
      flex: 1,
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
      flex: 1,
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
      flex: 1,
    },
    {
      field: "detail",
      headerName: "Chi tiết đơn hàng",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const details: OrderDetail[] = params.row.OrderDetails;
        const delivery: Delivery = params.row.Delivery;
        const payment: Payment = params.row.Payment;

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
                    content: (
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
                            Phương thức:{" "}
                            {payment.method === "cash"
                              ? "Tiền mặt"
                              : "Chuyển khoản"}
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
                              {new Date(payment.paid_at).toLocaleString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
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
                                    {`${item.ProductColor.Product.name} (${item.ProductColor.Color.name})`}
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
                                <TableCell
                                  sx={{ textAlign: "right" }}
                                  colSpan={3}
                                >
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
                        <strong>
                          Tổng trị giá:{" "}
                          <NumericFormat
                            value={params.row.totalAmount}
                            displayType="text"
                            thousandSeparator="."
                            decimalSeparator=","
                            suffix=" đ"
                          />
                        </strong>
                      </Box>
                    ),
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
  ],
  api: orderApi,
  customFormComponents: () => <OrderForm />,
};
