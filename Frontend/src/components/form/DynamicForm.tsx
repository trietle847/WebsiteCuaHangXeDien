import { Controller, type Control, useWatch } from "react-hook-form";
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
  // Watch tất cả values để check dependencies
  const formValues = useWatch({ control });

  return fields?.map((field) => {
    if (field.hidden) return null;

    // Check conditional rendering
    if (field.dependsOn) {
      const { field: dependField, value: expectedValue } = field.dependsOn;
      // Fallback: useWatch value → initial data value
      const currentValue = formValues[dependField] ?? data[dependField];

      // Nếu giá trị không khớp, không hiển thị field này
      if (currentValue !== expectedValue) {
        return null;
      }
    }

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
            control={control} // Pass control để dynamic components có thể useWatch
          />
        )}
      />
    );
  });
}
