import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { type JSX, memo } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface ContentDialogProps {
  open: boolean;
  title: string;
  content?: JSX.Element | null;
  onConfirm?: ((data?: any) => void) | null;
  onClose: () => void;
}

export default memo(function ContentDialog({
  open,
  title,
  content,
  onConfirm,
  onClose,
}: ContentDialogProps) {
  const methods = useForm();

  const handleConfirm = () => {
    if (onConfirm) {
      const formData = methods.getValues();
      // Chỉ truyền data nếu form có values
      const hasData = Object.keys(formData).length > 0;
      onConfirm(hasData ? formData : undefined);
    }
  };

  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={onClose}
      slotProps={{
        transition:{
          onExited() {
              methods.reset();
          },
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              bgcolor: "gray",
              "&:hover": { bgcolor: "darkgray" },
            }}
          >
            Đóng
          </Button>
          {onConfirm && (
            <Button
              variant="contained"
              onClick={() => handleConfirm()}
              sx={{
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "red",
                },
              }}
            >
              Xác nhận
            </Button>
          )}
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
});
