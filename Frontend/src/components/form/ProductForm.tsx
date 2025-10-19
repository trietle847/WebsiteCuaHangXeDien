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
import { useForm, Controller} from "react-hook-form";
import { useState } from "react";
import productApi from "../../services/product.api";

interface ProductFormProps {
  data?: any;
}

export default function ProductForm({ data }: ProductFormProps) {
  const { control, unregister, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      name: data?.name || "",
      price: data?.price || "",
      stock_quantity: data?.stock_quantity || "",
      company_id: data?.company_id || "",
      specs: data?.ProductDetail || {},
    },
  });
  const [openSpecForm, setOpenSpecForm] = useState(false);

  const mode = data ? "edit" : "create";
  console.log("ProductForm mode:", mode);

  const specs = watch("specs");
  const hasSpecs = specs && Object.values(specs).some((value) => value !== undefined && value !== "");
  return (
    <Box
      sx={{
        gap: 3,
      }}
      id="product-form"
    >
      <Typography variant="h6" gutterBottom>
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
          control={control}
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
          control={control}
          rules={{
            required: "Giá sản phẩm là bắt buộc",
            min: {
              value: 0,
              message: "Giá phải lớn hơn 0",
            },
            validate: (value) => {
              const num = Number(value);
              if (isNaN(num)) return "Phải là số hợp lệ";
              if (num <= 0) return "Giá phải lớn hơn 0";
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Giá sản phẩm"
              variant="outlined"
              fullWidth
              type="number"
              required
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">VNĐ</InputAdornment>
                  ),
                },
                htmlInput: {
                  min: 0,
                },
              }}
            />
          )}
        />
        <Controller
          name="stock_quantity"
          control={control}
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
          control={control}
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
      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
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
          onClose={() => setOpenSpecForm(false)}
          onSave={(data) => {
            setValue("specs", data);
            console.log(data);
          }}
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
      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
        Màu sắc và hình ảnh
      </Typography>
      <ColorImages setValue={setValue} unregister={unregister} />
      <Button
        variant="contained"
        color="primary"
        sx={{
          mx: "auto",
          marginTop: 5,
          display: "block",
          width: 200,
        }}
        type="submit"
        onClick={handleSubmit(async (data) => {
          try {
            console.log("Form Data:", data);
            // const formData = createProductFormData(data);
            const response = await productApi.create(data);
            console.log("API Response:", response);
          } catch (error) {
            console.log("Error creating form data:", error);
          }
        })}
      >
        Thêm sản phẩm
      </Button>
    </Box>
  );
}
