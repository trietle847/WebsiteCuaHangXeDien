import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { FormProvider } from "react-hook-form";
import { memo } from "react";
import { useDialogState, useDialogActions } from "../../context/DialogContext";

const GlobalDialog = memo(function GlobalDialog() {
  // Tách riêng state và actions để tối ưu re-render
  const {
    open,
    title,
    content,
    dialogSize,
    onConfirm,
    customTitle,
    customActions,
    formMethods,
  } = useDialogState();
  const { closeDialog } = useDialogActions();

  const handleConfirm = () => {
    if (onConfirm) {
      const formData = formMethods ? formMethods.getValues() : {};
      const hasData = Object.keys(formData).length > 0;
      onConfirm(hasData ? formData : undefined);
    }
  };

  if (!open && !content) {
    return null;
  }

  return (
    <Dialog
      maxWidth={dialogSize || "lg"}
      fullWidth={Boolean(dialogSize)}
      open={open}
      onClose={closeDialog}
    >
      {customTitle ? (
        customTitle
      ) : (
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component={"div"} fontWeight={500}>
            {title}
          </Typography>
          <IconButton onClick={closeDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
      )}

      {formMethods ? (
        <FormProvider {...formMethods}>
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
            {customActions
              ? customActions
              : onConfirm && (
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
      ) : (
        <Box>
          <DialogContent>{open && content}</DialogContent>
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
            {customActions
              ? customActions
              : onConfirm && (
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
        </Box>
      )}
    </Dialog>
  );
});

export default GlobalDialog;
