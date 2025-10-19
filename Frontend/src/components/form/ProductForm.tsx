import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SpecificationForm from "./SpecificationForm";
import ColorImages from "./ColorImages";
import { textValidation } from "../../lib/entities/form/inputConfig";
import { selectManage } from "../../lib/entities/form/inputConfig";
import { companyFormConfig } from "../../lib/entities/form/product.form";
import { useForm, Controller} from "react-hook-form";
import { useState } from "react";
import productApi from "../../services/product.api";

export default function ProductForm() {
  const { control, unregister, watch, setValue, handleSubmit } = useForm();
  const [openSpecForm, setOpenSpecForm] = useState(false);

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
        <Controller
          name="name"
          control={control}
          defaultValue={""}
          rules={{
            ...textValidation.name(3, 100),
            required: "Tên sản phẩm là bắt buộc",
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Tên sản phẩm"
              variant="outlined"
              name="product_name"
              required
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="price"
          control={control}
          rules={{
            ...textValidation.number(0),
            required: "Giá sản phẩm là bắt buộc",
          }}
          defaultValue={""}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              name="product_price"
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
            ...textValidation.number(0),
            required: "Số lượng tồn kho là bắt buộc",
          }}
          defaultValue={""}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              name="stock_quantity"
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
          defaultValue={""}
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
        <Button variant="contained" sx={{
            "&:hover": {
                bgcolor: hasSpecs ? "warning.dark" : ""
            },
            bgcolor: hasSpecs ? "warning.light" : ""

        }} onClick={() => setOpenSpecForm(true)}>
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
          }
          catch (error) {
            console.log("Error creating form data:", error);
          }
        })}
      >
        Thêm sản phẩm
      </Button>
    </Box>
  );
}
