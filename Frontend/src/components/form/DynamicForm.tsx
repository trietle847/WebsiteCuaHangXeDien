import { Controller, type Control, useWatch } from "react-hook-form";
import type { FieldConfig } from "../../lib/entities/form/formConfig";
import { da } from "date-fns/locale";

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
      multipleFields,
    } = field;

    const InputComponent = input.Component;

    // Nếu có multipleFields, đăng ký nhiều fields nhưng render 1 component
    if (multipleFields && multipleFields.length > 0) {
      // Component như PolicyInput sẽ tự đăng ký các fields thông qua useFieldArray
      // với control được pass vào. Chỉ cần render 1 lần.
      multipleFields.forEach((subField) => {
        control.register(subField, {
          value: data[subField] || input.defaultValue?.[subField],
        });
      });
      return (
        <div key={key}>
          <InputComponent
            name={propname}
            label={label}
            required={required}
            disabled={disabled}
            control={control}
            data={data}
          />
        </div>
      );
    }

    // Render bình thường cho single field
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
