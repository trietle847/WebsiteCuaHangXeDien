import { Controller } from "react-hook-form";
import { defineConfig } from "./formConfig";

type DynamicFormProps = {
  formConfig: ReturnType<typeof defineConfig>;
  data?: any;
  control: any;
};

export default function DynamicForm({
  formConfig,
  data,
  control,
}: DynamicFormProps) {
  return formConfig.config?.map((attr) => {
    const { key, input, ...restConfig } = attr;
    const InputComponent = input.render;
    const inputProps = {
      ...restConfig,
      value: data ? data[key] : input.initValue,
    };
    return (
      <Controller
        key={key}
        name={key}
        control={control}
        defaultValue={inputProps.value}
        render={({ field, fieldState }) => (
          <InputComponent
            {...restConfig}
            {...field}
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
          />
        )}
      />
    );
  });
}
