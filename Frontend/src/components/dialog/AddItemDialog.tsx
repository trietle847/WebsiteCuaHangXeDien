import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { defineConfig } from "../form/formConfig";
import DynamicForm from "../form/DynamicForm";
import { useForm } from "react-hook-form";
import ApiClient from "../../services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddItemDialogProps = {
  open: boolean;
  handleClose: () => void;
  config: ReturnType<typeof defineConfig>;
  api: ApiClient;
  width?: "sm" | "md" | "lg" | "xl" | false
};

export default function AddItemDialog({
  open,
  handleClose,
  config,
  api,
  width
}: AddItemDialogProps) {
  const title = `Thêm ${config.label.toLowerCase()}`;
  const { handleSubmit, control } = useForm();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newData: any) => api.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.name] });
      handleClose();
    },
  });

  const handleAdd = async (data: any) => {
    try {
      console.log("Form submitted successfully");
      console.log("Form data:", data);
      if (!confirm("Bạn có chắc chắn muốn thêm mục này không?")) {
        return Promise.reject("User cancelled addition");
      }
      mutation.mutate(data);
      handleClose();
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <form onSubmit={handleSubmit(handleAdd)} id="add-item-form" noValidate>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: "#26b170",
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <AddIcon sx={{ fontSize: 26 }} />
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
              formConfig={{
                ...config,
                config: config.createConfig || config.config,
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
            onClick={handleClose}
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
            size="large"
            sx={{
              minWidth: 100,
              bgcolor: "#26b170",
              "&:hover": {
                bgcolor: "#4ecea0", // Lighter shade of the original color
              },
            }}
          >
            Thêm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
