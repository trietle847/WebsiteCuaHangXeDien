import { Box } from "@mui/material";
import useEntityConfig from "../../hooks/useEntityConfig";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DynamicForm from "../../components/form/DynamicForm";
import { useForm } from "react-hook-form";

export default function EntityForm() {
  const { config, error } = useEntityConfig();
  const { id } = useParams();
  const { control } = useForm();

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

  if(id) console.log(data);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (isError) return <div>Lỗi tải dữ liệu hoặc không tìm thấy!</div>;

  if (config.customFormComponents) {
    return config.customFormComponents(data?.data);
  }

  if (config.formConfig) {
    let formConfig = id
      ? config.formConfig.updateConfig
      : config.formConfig.createConfig;
    return (
      <Box>
        Entity Form for {config.name} {id ? `Editing ${id}` : "Creating New"}
        <DynamicForm
          formConfig={{ ...config.formConfig, config: formConfig }}
          data={data?.data || {}}
          control={control}
        />
      </Box>
    );
  }
}
