import { Box, Button } from "@mui/material";
import useEntityConfig from "../../hooks/useEntityConfig";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DynamicForm from "../../components/form/DynamicForm";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EntityForm() {
  const { config, error } = useEntityConfig();
  const { id } = useParams();
  const { control, reset ,handleSubmit } = useForm();

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
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (formData: any) =>
      id ? config.api.update(Number(id), formData) : config.api.create(formData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [config.name] });
      if(response.message) toast.success(response.message || "");
      else toast.success(`Thao tác ${id ? "cập nhật" : "thêm mới"} thành công!`);
      if(!id) reset();
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(
        error?.message ||
          `Thao tác ${id ? "cập nhật" : "thêm mới"} thất bại! Hãy thử lại sau.`
      );
    }
  });

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
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          mx: "auto",
          mt: 4,
          gap: 2,
        }}>
          <Button
            variant="contained"
            sx={{
              display: "block",
              bgcolor: "darkgray",
              "&:hover": { bgcolor: "gray" },
            }}
            onClick={() => navigate(-1)}
          >
            Trở về
          </Button>
          <Button
            type="submit"
            form="entity-form"
            variant="contained"
            sx={{ display: "block" }}
          >
            {id ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Box>
      </Box>
    );
  }
}
