import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SpecificationForm from "./SpecificationForm";
import ColorImages from "./ColorImages";
import { selectManage } from "../../lib/entities/form/inputConfig";
import { companyFormConfig } from "../../lib/entities/form/product.form";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import productApi from "../../services/product.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

interface ProductFormProps {
  data?: any;
}

export default function ProductForm({ data }: ProductFormProps) {
  const methods = useForm({
    defaultValues: {
      name: data?.name || "",
      price: data?.price || "",
      stock_quantity: data?.stock_quantity || "",
      company_id: data?.company_id || "",
      specs: data?.ProductDetail || {},
      addImgPCIds: [],
      deleteImageIds: new Set<number>(),
      deleteProductColorIds: new Set<string>(),
    },
  });
  const [openSpecForm, setOpenSpecForm] = useState(false);
  const navigate = useNavigate();

  const mode = data ? "edit" : "create";
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (formData: any) =>
      mode === "create"
        ? productApi.create(formData)
        : productApi.update(data.product_id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if(mode==="create") methods.reset();
    },
  });

  const specs = methods.watch("specs");
  const hasSpecs =
    specs &&
    Object.values(specs).some((value) => value !== undefined && value !== "");

  // Khi data fetch về, reset form
  useEffect(() => {
    if (data) {
      methods.reset({
        name: data?.name || "",
        price: data?.price || "",
        stock_quantity: data?.stock_quantity || "",
        company_id: data?.company_id || "",
        specs: data?.ProductDetail || {},
        addImgPCIds: [],
        deleteImageIds: new Set<number>(),
        deleteProductColorIds: new Set<string>(),
      });
    }
  }, [data, methods.reset]);

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          gap: 3,
        }}
        id="product-form"
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Thông tin cơ bản
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* ✅ Tên sản phẩm */}
          <Controller
            name="name"
            control={methods.control}
            rules={{
              required: "Tên sản phẩm là bắt buộc",
              minLength: {
                value: 3,
                message: "Tên phải có ít nhất 3 ký tự",
              },
              maxLength: {
                value: 100,
                message: "Tên không được quá 100 ký tự",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                name="product_name"
                label="Tên sản phẩm"
                variant="outlined"
                required
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="price"
            control={methods.control}
            rules={{
              required: "Giá sản phẩm là bắt buộc",
              min: {
                value: 1,
                message: "Giá phải lớn hơn 0",
              },
            }}
            render={({ field, fieldState }) => (
              <NumericFormat
                customInput={TextField}
                label="Giá sản phẩm"
                variant="outlined"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
                fullWidth
                required
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                value={field.value || ""} // ✅ Xử lý undefined/null
                allowNegative={false} // ✅ Chặn số âm
                onValueChange={(values) => {
                  // ✅ Xử lý khi xóa rỗng
                  field.onChange(values.floatValue || "");
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="stock_quantity"
            control={methods.control}
            rules={{
              required: "Số lượng tồn kho là bắt buộc",
              min: {
                value: 0,
                message: "Số lượng không được âm",
              },
              validate: (value) => {
                const num = Number(value);
                if (isNaN(num)) return "Phải là số hợp lệ";
                if (num < 0) return "Số lượng không được âm";
                if (!Number.isInteger(num)) return "Phải là số nguyên";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Số lượng tồn kho"
                variant="outlined"
                fullWidth
                type="number"
                required
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
            )}
          />
          <Controller
            name="company_id"
            control={methods.control}
            rules={{
              required: "Hãng xe là bắt buộc",
            }}
            render={({ field, fieldState }) =>
              selectManage(companyFormConfig, "name").render({
                ...field,
                required: true,
                error: fieldState.invalid,
                helperText: fieldState.error?.message,
                label: "Hãng xe",
              })
            }
          />
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 4, fontWeight: "bold" }}
        >
          Thông số kỹ thuật
        </Typography>
        {!hasSpecs ? (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Chưa có thông số kỹ thuật nào được thêm.
          </Typography>
        ) : (
          <Typography variant="body2" gutterBottom color="success">
            Đã thêm thông số kỹ thuật.
          </Typography>
        )}
        <Box>
          <SpecificationForm
            open={openSpecForm}
            onSave={(data) => {
              methods.setValue("specs", data);
              console.log("Saved specs:", data);
            }}
            onClose={() => setOpenSpecForm(false)}
            initialValues={specs}
          />
          <Button
            variant="contained"
            sx={{
              "&:hover": {
                bgcolor: hasSpecs ? "warning.dark" : "",
              },
              bgcolor: hasSpecs ? "warning.light" : "",
            }}
            onClick={() => setOpenSpecForm(true)}
          >
            {hasSpecs ? "Chỉnh sửa thông số" : "Thêm thông số"}
          </Button>
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 4, fontWeight: "bold" }}
        >
          Màu sắc và hình ảnh
        </Typography>
        <ColorImages ProductColors={data?.ProductColors} />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 5,
            justifyContent: "center",
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
            Trở về
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              display: "block",
            }}
            type="submit"
            onClick={methods.handleSubmit(async (formData) => {
              try {
                console.log("Form Data:", formData);
                const response = await mutation.mutateAsync(formData);
                console.log("API Response:", response);
              } catch (error) {
                console.log("Error creating form data:", error);
              }
            })}
          >
            {mode === "create" ? "Thêm" : "Cập nhật"} sản phẩm
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}
