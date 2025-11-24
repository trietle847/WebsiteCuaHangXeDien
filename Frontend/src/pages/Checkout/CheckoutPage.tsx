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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { clearCheckoutItems } from "../../redux/slices/checkoutSlice";
import orderApi from "../../services/order.api";
import paymentApi from "../../services/payment.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormatNumber from "../../helpper/FormatNumber";
import VoucherInput from "../../components/inputs/VoucherInput";
import type { Promotion } from "../../lib/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.checkout.items || []);
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      shippingMethod: "home_delivery",
      paymentMethod: "cash",
      note: "",
    },
  });

  const shippingMethod = watch("shippingMethod");
  const paymentMethod = watch("paymentMethod");

  const [momoData, setMomoData] = useState<{ payUrl: string } | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Promotion | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const totalAmount = items.reduce(
    (sum: number, item: any) =>
      sum +
      (item.price || item.ProductColor?.Product?.price || 0) *
        (item.quantity || 0),
    0
  );

  const getFullUrl = (url: string) =>
    url?.startsWith("http") ? url : `http://localhost:3000${url}`;

  const calculatePromotionDiscount = (
    totalAmount: number,
    promotion: Promotion | null
  ) => {
    if (!promotion) return 0;
    let discount = 0;
    if (promotion.discount_type === "fixed_amount") {
      discount = promotion.discount_value;
    } else {
      discount = (totalAmount * promotion.discount_value) / 100;
      if (
        promotion.max_discount_amount !== null &&
        discount > promotion.max_discount_amount
      ) {
        discount = promotion.max_discount_amount;
      }
    }
    return discount;
  };

  const onSubmit = async (formData: any) => {
    const payload = {
      items: items.map((item: any) => ({
        productColor_id: item.productColorId,
        quantity: item.quantity,
      })),
      note: formData.note,
      delivery: {
        method:
          formData.shippingMethod === "delivery" ? "home_delivery" : "at_store",
        address: formData.address || null,
        cost: formData.shippingMethod === "home_delivery" ? 50000 : 0,
        recipient_name: formData.fullName,
        recipient_phone: formData.phone,
      },
      payment: {
        method: formData.paymentMethod === "cash" ? "cash" : "bank_transfer",
      },
      promotion_id: selectedVoucher ? selectedVoucher.promotion_id : null,
      promotion_code: selectedVoucher ? selectedVoucher.code : null,
    };

    try {
      setLoading(true);
      const orderRes = await orderApi.create(payload);
      console.log(orderRes);

      // Thanh toán online Momo
      if (formData.paymentMethod === "transfer") {
        const momoRes = await paymentApi.createMomoPayment(
          orderRes.data.order_id
        );
        setMomoData({ payUrl: momoRes.payUrl });
        toast.info("Đơn hàng đã tạo! Nhấn nút bên dưới để thanh toán Momo.", {
          autoClose: false,
          closeOnClick:true,
          // onClose: () => {
          //   dispatch(clearCheckoutItems());
          //   navigate("/orders");
          // },
        });
      } else {
        toast.success("Đặt hàng thành công!", {
          autoClose: 3000,
          onClose: () => {
            dispatch(clearCheckoutItems());
            navigate(
              `/payment-handle?orderId=${orderRes.data.order_id}&orderType=cod`
            );
          },
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi checkout:", error);
      toast.error("Lỗi khi đặt hàng: " + (error.message || "Server error"), {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          mb={3}
          textAlign="center"
        >
          Thanh toán đơn hàng
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
            gap={3}
          >
            {/* Cột trái */}
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Thông tin người nhận */}
              <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                    color="primary"
                  >
                    Thông tin người nhận hàng
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={2}>
                    <Controller
                      name="fullName"
                      control={control}
                      rules={{ required: "Vui lòng nhập họ tên người nhận" }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Họ và tên người nhận"
                          fullWidth
                          size="medium"
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
                          size="medium"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mt={1}
                      color="primary"
                    >
                      Phương thức giao hàng
                    </Typography>
                    <Controller
                      name="shippingMethod"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value="home_delivery"
                            control={<Radio color="primary" />}
                            label="Giao hàng tận nơi"
                          />
                          <FormControlLabel
                            value="at_store"
                            control={<Radio color="primary" />}
                            label="Nhận tại cửa hàng"
                          />
                        </RadioGroup>
                      )}
                    />

                    {shippingMethod === "home_delivery" && (
                      <Controller
                        name="address"
                        control={control}
                        rules={{ required: "Vui lòng nhập địa chỉ giao hàng" }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Địa chỉ giao hàng"
                            fullWidth
                            size="medium"
                            multiline
                            rows={2}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    )}

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mt={1}
                      color="primary"
                    >
                      Ghi chú
                    </Typography>
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
                          size="medium"
                        />
                      )}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Phương thức thanh toán */}
              <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                    color="primary"
                  >
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
                          label="Thanh toán khi nhận hàng"
                        />
                        <FormControlLabel
                          value="transfer"
                          control={<Radio color="primary" />}
                          label="Chuyển khoản qua Momo / QR Code"
                        />
                      </RadioGroup>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Voucher */}
              <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                    color="primary"
                  >
                    Thêm mã giảm giá
                  </Typography>
                  <VoucherInput
                    orderValue={totalAmount}
                    onChange={setSelectedVoucher}
                  />
                </CardContent>
              </Card>

              {/* QR Momo */}
              {paymentMethod === "transfer" && momoData && (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    textAlign: "center",
                    p: 3,
                    background: "linear-gradient(135deg, #ffe5f0, #ffc2dd)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={2}
                      color="primary"
                    >
                      Thanh toán qua Momo
                    </Typography>
                    <Typography variant="body1" mb={3}>
                      Nhấn nút bên dưới để bắt đầu thanh toán.
                      <br />
                      Tổng tiền cần thanh toán:{" "}
                      <strong style={{ color: "#d81b60" }}>
                        {FormatNumber(
                        totalAmount +
                          (shippingMethod === "home_delivery" ? 50000 : 0) -
                          calculatePromotionDiscount(
                            totalAmount,
                            selectedVoucher
                          )
                      )} đ
                      </strong>
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "#d81b60",
                        "&:hover": { backgroundColor: "#ad1457" },
                        borderRadius: 4,
                        px: 4,
                        py: 1.5,
                        fontWeight: "bold",
                      }}
                      onClick={() => window.open(momoData.payUrl, "_blank")}
                    >
                      Thanh toán ngay qua Momo
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Cột phải: Đơn hàng */}
            <Box>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Đơn hàng của bạn
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box maxHeight={400} sx={{ overflowY: "auto" }}>
                    {items.map((item: any, index: number) => {
                      const price =
                        item.price || item.ProductColor?.Product?.price || 0;
                      const quantity = item.quantity || 0;
                      const name =
                        item.ProductColor?.Product?.name ||
                        item.name ||
                        "Sản phẩm";
                      const color =
                        item.ProductColor?.Color?.name || item.colorName || "-";
                      const image = getFullUrl(
                        item.image ||
                          item.ProductColor?.ColorImages?.[0]?.url ||
                          "/no-image.png"
                      );

                      return (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <img
                              src={image}
                              alt={name}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                            <Box>
                              <Typography fontWeight="600">{name}</Typography>
                              <Typography
                                variant="body2"
                                fontWeight="600"
                                color="text.secondary"
                              >
                                Màu: {color}
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight="600"
                                color="text.secondary"
                              >
                                Số lượng: {quantity}
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Typography fontWeight="bold">
                              {FormatNumber(price * quantity)} đ
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tạm tính:</Typography>
                    <Typography>{FormatNumber(totalAmount)} đ</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Phí vận chuyển:</Typography>
                    <Typography>
                      {FormatNumber(
                        shippingMethod === "home_delivery" ? 50000 : 0
                      )}{" "}
                      đ
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Khuyến mãi:</Typography>
                    <Typography>
                      -{" "}
                      {FormatNumber(
                        calculatePromotionDiscount(totalAmount, selectedVoucher)
                      )}{" "}
                      đ
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography fontWeight="bold">Tổng cộng:</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      {FormatNumber(
                        totalAmount +
                          (shippingMethod === "home_delivery" ? 50000 : 0) -
                          calculatePromotionDiscount(
                            totalAmount,
                            selectedVoucher
                          )
                      )}{" "}
                      đ
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: 3,
                      backgroundColor: "#1565c0",
                      "&:hover": { backgroundColor: "#0d47a1" },
                    }}
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </form>

        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Box>
    </Box>
  );
}
