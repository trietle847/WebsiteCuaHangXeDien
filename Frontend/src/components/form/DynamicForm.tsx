import { Controller, type Control } from "react-hook-form";
import type { FieldConfig } from "../../lib/entities/form/formConfig";

interface DynamicFormProps {
  fields: FieldConfig[];
  control: Control<any>;
  data: any;
}

export default function DynamicForm({
  fields,
  control,
  data,
}: DynamicFormProps) {
  return fields?.map((field) => {
    if (field.hidden) return null;

    const {
      key, // Data key: "first_name"
      propname, // HTML name: "user_first_name"
      label,
      input,
      validation,
      required,
      disabled,
    } = field;

    const InputComponent = input.Component;

    return (
      <Controller
        key={key}
        name={key} // ✅ Form data sử dụng key
        control={control}
        rules={validation}
        defaultValue={data[key] || input.defaultValue}
        render={({ field: fieldProps, fieldState }) => (
          <InputComponent
            {...fieldProps}
            name={propname} // ✅ HTML attribute dùng propname
            label={label}
            required={required}
            disabled={disabled}
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
          />
        )}
      />
    );
  });
}
