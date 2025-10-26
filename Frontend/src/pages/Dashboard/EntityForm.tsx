import { Box, Button } from "@mui/material";
import useEntityConfig from "../../hooks/useEntityConfig";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DynamicForm from "../../components/form/DynamicForm";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

export default function EntityForm() {
  const { config, error } = useEntityConfig();
  const { id } = useParams();
  const { control, handleSubmit } = useForm();

  if (error) return error;
  if (!config) return <div>Entity config not found</div>;

  const { data, isLoading, isError } = useQuery({
    queryKey: [config.name, id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      return await config.api.getById(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: true, // luôn fetch lại khi reload/tab focus
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: any) =>
      id ? config.api.update(Number(id), formData) : config.api.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.name] });
      toast.success(`Thao tác ${id ? "cập nhật" : "thêm mới"} thành công!`);
    }
  });

  if(id) console.log(data);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (isError) return <div>Lỗi tải dữ liệu hoặc không tìm thấy!</div>;

  if (config.customFormComponents) {
    return config.customFormComponents(data?.data);
  }

  if (config.formConfig) {
    let formConfig = id
      ? config.formConfig.updateFields
      : config.formConfig.createFields;
    return (
      <Box
        component={"form"}
        id="entity-form"
        noValidate
        onSubmit={handleSubmit((formData: any) => mutation.mutate(formData))}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <DynamicForm
            fields={formConfig}
            data={data?.data || {}}
            control={control}
          />
          <ToastContainer position="top-right" autoClose={3000} />
        </Box>
        <Button
          type="submit"
          form="entity-form"
          variant="contained"
          sx={{ mt: 3, mx: "auto", display: "block" }}
        >
          {id ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Box>
    );
  }
}
