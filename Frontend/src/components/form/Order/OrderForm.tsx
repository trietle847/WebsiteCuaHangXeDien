import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "../../inputs/Autocomplete";
import { useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import userApi from "../../../services/user.api";
import type { OrderItem } from "../../../lib/types";
import ProductSelection from "./ProductSelection";
import ProductTable from "./ProductTable";
import Delivery from "./Delivery";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import { NumericFormat } from "react-number-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import orderApi from "../../../services/order.api";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export default function OrderForm() {
  const methods = useForm<{
    user: any;
    items: OrderItem[];
    delivery: {
      method: string;
      address: string;
      recipient_name: string;
      recipient_phone: string;
      status: string;
      cost: number;
    };
    payment: { method: string; paid: boolean };
  }>({
    defaultValues: {
      user: null,
      items: [],
      delivery: {
        method: "at_store",
        address: "",
        recipient_name: "",
        recipient_phone: "",
        status: "completed",
        cost: 0,
      },
      payment: {
        method: "cash",
        paid: false,
      },
    },
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const items = methods.watch("items");
  const deliveryMethod = methods.watch("delivery.method");
  const deliveryCost = methods.watch("delivery.cost");

  const totalAmount = useMemo(() => {
    if (!items || items.length === 0) return 0;

    return items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  }, [items]);

  const shippingCost = useMemo(() => {
    if (deliveryMethod !== "home_delivery") return 0;

    const cost = Number(deliveryCost);
    return isNaN(cost) || cost < 0 ? 0 : cost;
  }, [deliveryMethod, deliveryCost]);

  const grandTotal = useMemo(() => {
    return totalAmount + shippingCost;
  }, [totalAmount, shippingCost]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => orderApi.createByStaff(data),
    onSuccess: () => {
      // Invalidate cả orders và products để cập nhật số lượng tồn kho
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Tạo đơn hàng thành công!");
      methods.reset();
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onFormSubmit = (data: any) => {
    // Validate user (bắt buộc)
    if (!data.user) {
      toast.error("Vui lòng chọn khách hàng");
      methods.setError("user", {
        type: "required",
        message: "Vui lòng chọn khách hàng",
      });
      return;
    }

    // Validate items (phải có ít nhất 1 sản phẩm)
    if (!data.items || data.items.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 sản phẩm vào đơn hàng");
      methods.setError("items", {
        type: "required",
        message: "Vui lòng thêm ít nhất 1 sản phẩm",
      });
      return;
    }

    // Validate quantity của từng item
    for (const item of data.items) {
      if (!item.quantity || item.quantity <= 0) {
        toast.error("Số lượng sản phẩm phải lớn hơn 0");
        return;
      }
      if (item.quantity > item.stock_quantity) {
        toast.error(`Sản phẩm ${item.productName} vượt quá tồn kho`);
        return;
      }
    }
    data.userId = data.user.user_id;
    delete data.user;
    data.payment.paid
      ? (data.payment.status = "completed")
      : (data.payment.status = "pending");
    mutation.mutate(data);
  };

  const navigate = useNavigate();

  return (
    <FormProvider {...methods}>
      <Box
        component={"form"}
        onSubmit={methods.handleSubmit(onFormSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Autocomplete
          value={selectedUser}
          api={userApi}
          idKey="user_id"
          optionLabelKey={["email", "fullname"]}
          label="Chọn khách hàng"
          placeholder="Nhập email..."
          required
          objectName="user"
          error={!!methods.formState.errors.user}
          helperText={
            typeof methods.formState.errors.user?.message === "string"
              ? methods.formState.errors.user?.message
              : undefined
          }
          onChange={(user) => {
            setSelectedUser(user);
            methods.setValue("user", user ? user : null);
            methods.clearErrors("user"); // Clear error khi chọn
          }}
        />
        <ProductSelection />
        <ProductTable />
        <Delivery />
        <Box>
          {/* Payment */}
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Thanh toán
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              select
              defaultValue="cash"
              label="Phương thức thanh toán"
              margin="normal"
              sx={{ width: 250 }}
              {...methods.register("payment.method")}
            >
              <MenuItem value="cash">Tiền mặt</MenuItem>
              <MenuItem value="bank_transfer">Chuyển khoản ngân hàng</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={false}
                  {...methods.register("payment.paid")}
                />
              }
              label="Đã thanh toán"
              sx={{ ml: 2 }}
            />
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Tổng trị giá:{" "}
            {deliveryMethod === "home_delivery" ? (
              <Box component="span">
                <NumericFormat
                  value={totalAmount}
                  displayType="text"
                  thousandSeparator="."
                  decimalSeparator=","
                />{" "}
                (TC) +{" "}
                <NumericFormat
                  value={shippingCost}
                  displayType="text"
                  thousandSeparator="."
                  decimalSeparator=","
                />{" "}
                (Ship) ={" "}
                <NumericFormat
                  value={grandTotal}
                  displayType="text"
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                />
              </Box>
            ) : (
              <NumericFormat
                value={totalAmount}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              display: "block",
              bgcolor: "darkgray",
              "&:hover": { bgcolor: "gray" },
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBack sx={{
              width: 18
            }} /> Trở về
          </Button>
          <Button
            sx={{ width: 200 }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Tạo đơn hàng
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}
