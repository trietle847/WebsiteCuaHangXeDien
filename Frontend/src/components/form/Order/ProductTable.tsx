import {
  Box,
  TextField,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Delete } from "@mui/icons-material";
import type { OrderItem } from "../../../lib/types";

export default function ProductTabble() {
  const { control, setValue, watch } = useFormContext<{ items: OrderItem[] }>();

  // Dùng watch để lấy items, không dùng useFieldArray
  const items = watch("items") || [];

  const handleRemove = (index: number) => {
    const currentItems = watch("items") || [];
    setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
        Danh sách sản phẩm đã chọn
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2">Chưa có sản phẩm nào được chọn.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Thành tiền</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: OrderItem, index: number) => (
                <TableRow key={item.productColor_id + index}>
                  <TableCell>
                    {`${item.productName} (${item.colorName})`}
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
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Controller
                        name={`items.${index}.quantity`}
                        control={control}
                        rules={{
                          required: "Không được rỗng",
                          min: { value: 1, message: "Phải > 0" },
                          max: {
                            value: item.stock_quantity,
                            message: `Tồn kho: ${item.stock_quantity}`,
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            type="number"
                            size="small"
                            error={fieldState.invalid}
                            helperText={fieldState.error?.message}
                            value={field.value}
                            onChange={(e) => {
                              const newQuantity =
                                parseInt(e.target.value) || "";
                              if (
                                typeof newQuantity === "number" &&
                                (newQuantity < 1 ||
                                  newQuantity > item.stock_quantity)
                              ) {
                                return;
                              }
                              field.onChange(newQuantity);

                              // Chỉ cập nhật totalPrice, không gọi update để tránh mất focus
                              const newTotalPrice =
                                newQuantity === ""
                                  ? ""
                                  : newQuantity * item.price;

                              setValue(
                                `items.${index}.totalPrice`,
                                newTotalPrice
                              );
                            }}
                            slotProps={{
                              htmlInput: {
                                min: 1,
                                max: item.stock_quantity,
                              },
                            }}
                            sx={{ width: 100 }}
                          />
                        )}
                      />
                      <Typography
                        sx={{
                          height: "100%",
                        }}
                        variant="body1"
                      >
                        {" / " + item.stock_quantity}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <NumericFormat
                      value={watch(`items.${index}.totalPrice`) || 0}
                      displayType="text"
                      thousandSeparator="."
                      decimalSeparator=","
                      suffix=" đ"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleRemove(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography sx={{ fontWeight: "bold" }}>Tổng cộng (TC):</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: "bold" }}>
                    <NumericFormat
                      value={items.reduce(
                        (sum, item) => sum + (item.totalPrice || 0),
                        0
                      )}
                      displayType="text"
                      thousandSeparator="."
                      decimalSeparator=","
                      suffix=" đ"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
