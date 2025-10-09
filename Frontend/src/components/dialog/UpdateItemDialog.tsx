import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { defineConfig } from "../form/formConfig";
import DynamicForm from "../form/DynamicForm";
import { useForm } from "react-hook-form";
import ApiClient from "../../services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type UpdateItemDialogProps = {
  open: boolean;
  handleClose: () => void;
  config: ReturnType<typeof defineConfig>;
  api: ApiClient;
  idName: string;
  data: any;
  width?: "sm" | "md" | "lg" | "xl" | false
};

export default function UpdateItemDialog({
  open,
  handleClose,
  config,
  api,
  idName,
  data,
  width
}: UpdateItemDialogProps) {
  const title = `Cập nhật ${config.label.toLowerCase()}`;
  const { handleSubmit, control, reset } = useForm({
    defaultValues: data || {},
  });

  const queryClient = useQueryClient();

  // Reset form khi data thay đổi
  useEffect(() => {
    if (open && data) {
      reset(data);
    }
  }, [open, data, reset]);

  const mutation = useMutation({
    mutationFn: (newData: any) => api.update(data[idName], newData),
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: [config.name] });
    },
  });

  const handleUpdate = async (formData: any) => {
    try {
      console.log("Form submitted successfully");
      console.log("Form data:", formData);
      mutation.mutate(formData);
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  const onClose = () => {
    reset(); // Reset form khi đóng dialog
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={width || "md"}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2.5,
            boxShadow: 16,
            overflow: "hidden",
          },
        },
      }}
    >
      <form
        onSubmit={handleSubmit(handleUpdate)}
        id="update-item-form"
        noValidate
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: "info.main",
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <EditIcon sx={{ fontSize: 26 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            px: 3,
            py: 3,
            bgcolor: "#fafafa",
            // Custom scrollbar styling
            "&::-webkit-scrollbar": {
              width: "8px",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#bdbdbd",
              borderRadius: "4px",
              "&:hover": {
                background: "#a0a0a0",
              },
            },
            // Set max height to prevent dialog from growing too large
            maxHeight: {
              xs: "calc(100vh - 200px)",
              sm: "65vh",
            },
            overflowY: "auto",
          }}
        >
          <Stack spacing={2.5}>
            <DynamicForm
              data={data}
              formConfig={{
                ...config,
                config: config.updateConfig || config.config,
              }}
              control={control}
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#fafafa",
            gap: 1,
          }}
        >
          <Button
            onClick={onClose}
            color="inherit"
            size="large"
            sx={{
              minWidth: 100,
              bgcolor: "gray",
              "&:hover": { bgcolor: "darkgray" },
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="info"
            size="large"
            sx={{ minWidth: 100 }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
