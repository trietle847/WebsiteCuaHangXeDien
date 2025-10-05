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
    const { key, input, label, validation, ...restConfig } = attr;
    const InputComponent = input.render;
    const inputProps = {
      ...restConfig,
      value: data ? data[key] : input.initValue,
    };

    // Kết hợp validation rules
    const rules = {
      ...validation, // Validation từ attr (bao gồm required)
      ...input.validation, // Validation từ input config
    };

    return (
      <Controller
        key={key}
        name={key}
        control={control}
        rules={rules} // Truyền validation rules vào Controller
        defaultValue={inputProps.value}
        render={({ field, fieldState }) => (
          <InputComponent
            {...restConfig}
            {...field}
            {...validation}
            label={label}
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
          />
        )}
      />
    );
  });
}
