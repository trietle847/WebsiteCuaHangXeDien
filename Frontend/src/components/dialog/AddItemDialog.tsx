import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
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
};

export default function AddItemDialog({
  open,
  handleClose,
  config,
  api,
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
      maxWidth="sm"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 2, p: 2 } }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          onSubmit={handleSubmit(handleAdd)}
          id="add-item-form"
          spacing={2}
          sx={{ mt: 1 }}
        >
          <DynamicForm
            formConfig={{
              ...config,
              config: config.createConfig || config.config,
            }}
            control={control}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="submit" form="add-item-form">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
