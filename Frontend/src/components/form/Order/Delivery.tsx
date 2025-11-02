import { TextField, MenuItem, Box, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format"; // Giả sử bạn có cài đặt này

const commonDeliveryInfo = [
  {
    key: "recipient_name",
    userKey: "fullname",
    label: "Tên người nhận",
    required: true,
  },
  {
    key: "recipient_phone",
    userKey: "phone",
    label: "Số điện thoại",
    required: true,
  },
];

const homeDeliveryInfo = [
  {
    key: "address",
    userKey: "address",
    label: "Địa chỉ giao hàng",
    required: true,
    fullWidth: true, // Địa chỉ nên chiếm cả dòng
    multiline: true, // Cho phép nhập nhiều dòng
    rows: 2, // Hiển thị 2 dòng
  },
  {
    key: "note",
    userKey: "",
    defaultValue: "",
    label: "Ghi chú",
    fullWidth: true, // Ghi chú cũng nên chiếm cả dòng
    multiline: true,
    rows: 2,
  },
];

export default function Delivery() {
  const { register, watch, setValue, control } = useFormContext();
  const userSelected = watch("user");
  const deliveryMethod = watch("delivery.method");

  // useEffect của bạn đã đúng, không cần thay đổi
  useEffect(() => {
    if (userSelected) {
      setValue("delivery.recipient_name", userSelected.fullname || "");
      setValue("delivery.recipient_phone", userSelected.phone || "");
    }
    if (deliveryMethod === "at_store") {
      setValue("delivery.address", "");
      setValue("delivery.cost", 0);
      setValue("delivery.status", "delivered");
      setValue("delivery.note", "");
    } else if (deliveryMethod === "home_delivery") {
      setValue("delivery.address", userSelected?.address || "");
      setValue("delivery.cost", 100000); // Phí giao hàng mặc định
      setValue("delivery.status", "pending");
    }
  }, [deliveryMethod, userSelected, setValue]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
        Thông tin giao hàng
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            sm: "1fr",
            md: "repeat(2, 1fr)",
          },
          columnGap: 2,
        }}
      >
        {/* Phương thức */}
        <TextField
          select
          label="Phương thức giao hàng"
          {...register("delivery.method")}
          defaultValue={"at_store"}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          <MenuItem value="at_store">Nhận tại cửa hàng</MenuItem>
          <MenuItem value="home_delivery">Giao hàng tận nơi</MenuItem>
        </TextField>

        {/* Tên và SĐT (từ mảng common) */}
        {commonDeliveryInfo.map((info) => (
          <Controller
            key={info.key}
            name={`delivery.${info.key}`}
            control={control}
            defaultValue=""
            rules={{
              required: info.required ? "Trường này là bắt buộc" : false,
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label={info.label}
                required={info.required}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
        ))}

        {deliveryMethod === "home_delivery" && (
          <Controller
            key="cost"
            name="delivery.cost"
            control={control}
            defaultValue={100000} // Giá trị mặc định khi hiện
            rules={{
              required: "Phí là bắt buộc",
              min: { value: 0, message: "Phí không được âm" },
              validate: (value) => {
                if (value === undefined || value === null || value === "") {
                  return "Phí giao hàng không được để trống";
                }
                if (isNaN(Number(value))) {
                  return "Phí giao hàng phải là số";
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <NumericFormat
                value={field.value ?? ""}
                label="Phí giao hàng"
                customInput={TextField}
                variant="outlined"
                fullWidth
                margin="normal"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                onValueChange={(values) => {
                  // Cho phép undefined khi field trống, nhưng convert về số khi có giá trị
                  field.onChange(values.floatValue ?? 0);
                }}
              />
            )}
          />
        )}
      </Box>

      {deliveryMethod === "home_delivery" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          {homeDeliveryInfo.map((info) => (
            <Controller
              key={info.key}
              name={`delivery.${info.key}`}
              control={control}
              defaultValue={info.defaultValue || ""}
              rules={{
                required: info.required ? "Trường này là bắt buộc" : false,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
                  label={info.label}
                  required={info.required}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline={info.multiline}
                  rows={info.rows}
                  sx={{ gridColumn: info.fullWidth ? "span 2" : "auto" }}
                />
              )}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
