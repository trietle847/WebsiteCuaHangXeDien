import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { textValidation } from "../../lib/entities/form/inputConfig";

interface SpecificationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialValues: any;
}

export default function SpecificationForm({
  open,
  onClose,
  onSave,
  initialValues,
}: SpecificationFormProps) {
    const { control, handleSubmit } = useForm();

  const specFields = [
    { name: "length", label: "Chiều dài", unit: "mm", rule: textValidation.number(0,undefined,"float") },
    { name: "width", label: "Chiều rộng", unit: "mm", rule: textValidation.number(0,undefined,"float") },
    { name: "height", label: "Chiều cao", unit: "mm", rule: textValidation.number(0,undefined,"float") },
    { name: "saddle_height", label: "Chiều cao yên", unit: "mm", rule: textValidation.number(0,undefined,"float") },
    { name: "maximum_speed", label: "Tốc độ tối đa", unit: "km/h", rule: textValidation.number(0,undefined,"float") },
    // { name: "weight", label: "Trọng lượng", unit: "kg" },
    { name: "battery", label: "Dung lượng pin", unit: "Ah", rule: textValidation.number(0,undefined,"float") },
    { name: "vehicle_engine", label: "Động cơ", unit: "", type: "text" },
    { name: "charging_time", label: "Thời gian sạc", unit: "giờ", rule: textValidation.number(0,undefined,"float") },
    { name: "maximum_load", label: "Tải trọng tối đa", unit: "kg", rule: textValidation.number(0,undefined,"float") },
  ];

  const localSubmit = (data: any) => {
    onSave(data);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}
    slotProps={{
      paper: {
        component: "form",
        onSubmit: handleSubmit(localSubmit),
      }
    }}
    >
      <DialogTitle>Thông số kỹ thuật</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            pt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {specFields.map((spec) => (
            <Box key={spec.name}>
              <Controller
                name={spec.name}
                control={control}
                rules={spec.rule}
                defaultValue={initialValues ? initialValues[spec.name] || "" : ""}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    value={field.value??""}
                    fullWidth
                    margin="dense"
                    label={spec.label}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    type={spec.type || "number"}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            {spec.unit}
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          type="submit"
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
