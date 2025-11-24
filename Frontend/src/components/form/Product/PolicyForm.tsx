import { Button, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDialogActions } from "../../../context/DialogContext";
import PolicyInput from "../../inputs/Policy";

interface PolicyFormProps {
  maintenanceValue: any;
  warrantyValue: any;
  onChange?: (maintenance: any, warranty: any) => void;
}

export default function PolicyForm({
  maintenanceValue,
  warrantyValue,
  onChange,
}: PolicyFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      maintenance_policy: maintenanceValue || [],
      warranty_policy: warrantyValue || [],
    },
  });

  const hasMaintenance = maintenanceValue && maintenanceValue.length > 0;
  const hasWarranty = warrantyValue && warrantyValue.length > 0;
  const hasBoth = hasMaintenance && hasWarranty;
  const hasPartial = (hasMaintenance || hasWarranty) && !hasBoth;
  const hasNone = !hasMaintenance && !hasWarranty;

  const { openDialog, closeDialog } = useDialogActions();

  const handleOpenDialog = () => {
    openDialog({
      title: "Chính sách sản phẩm",
      content: <PolicyInput control={control} />,
      onConfirm: handleSubmit((data) => {
        if (onChange) {
          onChange(data.maintenance_policy, data.warranty_policy);
        }
        closeDialog();
      }),
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Các chính sách của sản phẩm
      </Typography>

      {hasBoth ? (
        <Typography
          variant="body2"
          sx={{ color: "success.main", fontWeight: 600 }}
        >
          ✓ Chính sách đã được thiết lập đầy đủ.
        </Typography>
      ) : hasPartial ? (
        <Typography
          variant="body2"
          sx={{ color: "warning.main", fontWeight: 600 }}
        >
          ⚠ Chính sách chưa được thiết lập đầy đủ.
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Chính sách chưa được thiết lập.
        </Typography>
      )}

      <Button
        variant="contained"
        color={hasBoth ? "success" : hasPartial ? "warning" : "primary"}
        onClick={handleOpenDialog}
        sx={{ mt: 1 }}
      >
        {hasNone ? "Thêm chính sách" : "Chỉnh sửa chính sách"}
      </Button>
    </Box>
  );
}
