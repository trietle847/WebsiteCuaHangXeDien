import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCheckoutItems,
  removeCheckoutItem,
} from "../../redux/slices/checkoutSlice";
import orderApi from "../../services/order.api";
import { useNavigate } from "react-router-dom";
import VoucherInput from "../../components/inputs/VoucherInput";
import { useState, useMemo } from "react";
import type { Promotion } from "../../lib/types";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.checkout.items || []);
  const navigate = useNavigate();
  const [selectedVoucher, setSelectedVoucher] = useState<Promotion | null>(
    null
  );

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      shippingMethod: "delivery",
      paymentMethod: "cash",
      note: "",
    },
  });

  const shippingMethod = watch("shippingMethod");

  // Tổng giá sản phẩm
  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum: number, item: any) =>
          sum +
          (item.price || item.ProductColor?.Product?.price || 0) *
            (item.quantity || 0),
        0
      ),
    [items]
  );

  // Tính giảm giá voucher
  const discountAmount = useMemo(() => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.discount_type === "percentage") {
      const amount = (totalAmount * selectedVoucher.discount_value) / 100;
      return selectedVoucher.max_discount_amount
        ? Math.min(amount, selectedVoucher.max_discount_amount)
        : amount;
    }
    return selectedVoucher.discount_value;
  }, [selectedVoucher, totalAmount]);

  // Phí giao hàng
  const shippingCost = shippingMethod === "delivery" ? 20000 : 0;

  // Tổng thanh toán cuối cùng
  const finalAmount = totalAmount - discountAmount + shippingCost;

  const getFullUrl = (url: string) =>
    url?.startsWith("http") ? url : `http://localhost:3000${url}`;

  const onSubmit = async (formData: any) => {
    if (items.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    const payload = {
      items: items.map((item: any) => ({
        productColor_id: item.productColorId,
        quantity: item.quantity,
      })),
      note: formData.note || "Khách đặt online",
      delivery: {
        method:
          formData.shippingMethod === "delivery" ? "home_delivery" : "at_store",
        address: formData.address || null,
        cost: shippingCost,
        recipient_name: formData.fullName,
        recipient_phone: formData.phone,
      },
      payment: {
        method: formData.paymentMethod === "cash" ? "cash" : "bank_transfer",
      },
      voucher: {
        promotion_id: selectedVoucher ? selectedVoucher.promotion_id : null,
      },
    };

    try {
      await orderApi.create(payload);
      dispatch(clearCheckoutItems());
      alert("Đặt hàng thành công!");
      navigate("/orders");
    } catch (error: any) {
      console.error("Lỗi khi checkout:", error);
      alert("❌ Lỗi khi đặt hàng: " + (error.message || "Server error"));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1080, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
        🧾 Thanh toán đơn hàng
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Thông tin giao hàng */}
        <Card sx={{ borderRadius: 3, mb: 3, border: "1px solid #e0e0e0" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Thông tin giao hàng
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Vui lòng nhập họ tên" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Họ và tên"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Vui lòng nhập số điện thoại",
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Số điện thoại"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="shippingMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="delivery"
                      control={<Radio color="primary" />}
                      label="Giao hàng tận nơi"
                    />
                    <FormControlLabel
                      value="store"
                      control={<Radio color="primary" />}
                      label="Nhận tại cửa hàng"
                    />
                  </RadioGroup>
                )}
              />
              {shippingMethod === "delivery" && (
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Vui lòng nhập địa chỉ giao hàng" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Địa chỉ giao hàng"
                      multiline
                      rows={2}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ghi chú (tùy chọn)"
                    multiline
                    rows={2}
                    fullWidth
                  />
                )}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Phương thức thanh toán */}
        <Card sx={{ borderRadius: 3, mb: 3, border: "1px solid #e0e0e0" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Phương thức thanh toán
            </Typography>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="cash"
                    control={<Radio color="primary" />}
                    label="Thanh toán khi nhận hàng (Tiền mặt)"
                  />
                  <FormControlLabel
                    value="transfer"
                    control={<Radio color="primary" />}
                    label="Chuyển khoản ngân hàng"
                  />
                </RadioGroup>
              )}
            />
          </CardContent>
        </Card>

        {/* Danh sách sản phẩm */}
        <Card sx={{ borderRadius: 3, mb: 3, border: "1px solid #e0e0e0" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Sản phẩm trong đơn hàng
            </Typography>
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, borderColor: "#ddd", overflow: "hidden" }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#f8f8f8" }}>
                  <TableRow>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell align="center">Màu</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá (₫)</TableCell>
                    <TableCell align="right">Thành tiền (₫)</TableCell>
                    <TableCell align="center">Xóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item: any, index: number) => {
                    const price =
                      item.price || item.ProductColor?.Product?.price || 0;
                    const quantity = item.quantity || 0;
                    const productName =
                      item.name ||
                      item.productName ||
                      item.ProductColor?.Product?.name ||
                      "Sản phẩm";
                    const colorName =
                      item.colorName ||
                      item.selectedColor?.Color?.name ||
                      item.ProductColor?.Color?.name ||
                      "-";
                    const imageUrl =
                      item.image ||
                      item.selectedColor?.ColorImages?.[0]?.url ||
                      "/no-image.png";

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <img
                            src={getFullUrl(imageUrl)}
                            alt={productName}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        </TableCell>
                        <TableCell>{productName}</TableCell>
                        <TableCell align="center">{colorName}</TableCell>
                        <TableCell align="center">{quantity}</TableCell>
                        <TableCell align="right">
                          {price.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {(price * quantity).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            onClick={() =>
                              dispatch(removeCheckoutItem(item.productColorId))
                            }
                            sx={{
                              color: "red",
                              background: "none",
                              minWidth: 0,
                              p: 0,
                              "&:hover": { background: "none" },
                            }}
                          >
                            <Delete />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Tổng cộng, giảm giá, phí giao hàng, tổng thanh toán */}
                  <TableRow sx={{ backgroundColor: "#f8f8f8" }}>
                    <TableCell colSpan={5} align="right">
                      <Typography fontWeight="bold">
                        Tổng giá sản phẩm:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        {totalAmount.toLocaleString()} ₫
                      </Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>

                  {discountAmount > 0 && (
                    <TableRow sx={{ backgroundColor: "#f0f9f0" }}>
                      <TableCell colSpan={5} align="right">
                        <Typography fontWeight="bold" color="success.main">
                          Giảm giá ({selectedVoucher?.code}):
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="success.main">
                          -{discountAmount.toLocaleString()} ₫
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  )}

                  {shippingCost > 0 && (
                    <TableRow sx={{ backgroundColor: "#fff3e0" }}>
                      <TableCell colSpan={5} align="right">
                        <Typography fontWeight="bold" color="warning.main">
                          Phí giao hàng:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="warning.main">
                          {shippingCost.toLocaleString()} ₫
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  )}

                  <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                    <TableCell colSpan={5} align="right">
                      <Typography fontWeight="bold" color="primary">
                        Tổng thanh toán:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold" color="primary">
                        {finalAmount.toLocaleString()} ₫
                      </Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </CardContent>
        </Card>

        {/* Voucher */}
        <Card sx={{ borderRadius: 3, mb: 3, border: "1px solid #e0e0e0" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Thêm voucher
            </Typography>
            <VoucherInput
              orderValue={totalAmount}
              onChange={setSelectedVoucher}
            />
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 3,
              fontWeight: "bold",
              textTransform: "none",
              backgroundColor: "#1565c0",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            Xác nhận đặt hàng
          </Button>
        </Box>
      </form>
    </Box>
  );
}
