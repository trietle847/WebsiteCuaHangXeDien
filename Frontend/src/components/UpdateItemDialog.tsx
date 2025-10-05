import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { defineConfig } from "./form/formConfig";
import DynamicForm from "./form/DynamicForm";
import { useForm } from "react-hook-form";
import ApiClient from "../services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type UpdateItemDialogProps = {
  open: boolean;
  handleClose: () => void;
  config: ReturnType<typeof defineConfig>;
  api: ApiClient;
  idName: string;
  data: any;
};

export default function UpdateItemDialog({
  open,
  handleClose,
  config,
  api,
  idName,
  data,
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
          onSubmit={handleSubmit(handleUpdate)}
          id="add-item-form"
          spacing={2}
          sx={{ mt: 1 }}
        >
          <DynamicForm data={data} formConfig={config} control={control} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button type="submit" form="add-item-form" variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}
