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
import { useEffect } from "react"; // 2. Import useEffect

interface SpecificationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialValues?: any;
}

export default function SpecificationForm({
  open,
  onClose,
  onSave,
  initialValues,
}: SpecificationFormProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: initialValues || {},
  });

  useEffect(() => {
    if (open) {
      reset(initialValues || {});
    }
  }, [open, initialValues, reset]);

  const specFields = [
    { name: "length", label: "Chiều dài", unit: "mm" },
    { name: "width", label: "Chiều rộng", unit: "mm" },
    { name: "height", label: "Chiều cao", unit: "mm" },
    { name: "saddle_height", label: "Chiều cao yên", unit: "mm" },
    { name: "maximum_speed", label: "Tốc độ tối đa", unit: "km/h" },
    // { name: "weight", label: "Trọng lượng", unit: "kg" },
    { name: "battery", label: "Dung lượng pin", unit: "Ah" },
    { name: "vehicle_engine", label: "Động cơ", unit: "" },
    { name: "charging_time", label: "Thời gian sạc", unit: "giờ" },
    { name: "maximum_load", label: "Tải trọng tối đa", unit: "kg" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Thông số kỹ thuật</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          {specFields.map((spec) => (
            <Box key={spec.name}>
              <Controller
                name={spec.name}
                control={control}
                defaultValue={initialValues ? initialValues[spec.name] : ""}
                rules={textValidation.number(0)}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="dense"
                    label={spec.label}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    type="number"
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
        <Button type="submit" onClick={() => { handleSubmit(onSave)(); onClose()}}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
