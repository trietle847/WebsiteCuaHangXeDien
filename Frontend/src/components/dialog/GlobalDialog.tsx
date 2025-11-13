import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";
import { memo } from "react";
import { useDialogState, useDialogActions } from "../../context/DialogContext";

const GlobalDialog = memo(function GlobalDialog() {
  // Tách riêng state và actions để tối ưu re-render
  const { open, title, content, onConfirm } = useDialogState();
  const { closeDialog } = useDialogActions();

  const methods = useForm();

  const handleConfirm = () => {
    if (onConfirm) {
      const formData = methods.getValues();
      const hasData = Object.keys(formData).length > 0;
      onConfirm(hasData ? formData : undefined);
    }
  };

  const handleExited = () => {
    methods.reset();
  };

  if (!open && !content) {
    return null;
  }

  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={closeDialog}
      slotProps={{
        transition: {
          onExited: handleExited,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton onClick={closeDialog} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>{open && content}</DialogContent>

        {/* Actions */}
        <DialogActions>
          <Button
            onClick={closeDialog}
            sx={{
              bgcolor: "gray",
              "&:hover": { bgcolor: "darkgray" },
            }}
          >
            Hủy
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

export default GlobalDialog;
