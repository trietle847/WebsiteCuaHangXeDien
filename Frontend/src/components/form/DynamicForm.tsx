import { Controller, useWatch, useFormContext } from "react-hook-form";
import type { FieldConfig } from "../../lib/entities/form/formConfig";

interface DynamicFormProps {
  fields: FieldConfig[];
  data: any;
}

export default function DynamicForm({
  fields,
  data,
}: DynamicFormProps) {
  const { control } = useFormContext();

const watchedDependentFields = fields.reduce((acc, field) => {
  if (field.dependsOn) {
    acc[field.dependsOn.field] = true;
  }
  return acc;
}, {} as Record<string, boolean>);

const dependentFieldNames = Object.keys(watchedDependentFields);

  // 1. useWatch trả về mảng giá trị
  const dependentValuesArray = useWatch({
    control,
    name: dependentFieldNames.length > 0 ? dependentFieldNames : [], // Truyền mảng rỗng nếu không có field phụ thuộc để tránh lỗi
  });

  // 2. Map mảng giá trị thành Object: { "discount_type": "percentage" }
  const dependentValues = dependentFieldNames.reduce((acc, name, index) => {
    // dependentValuesArray có thể undefined nếu chưa mount xong hoặc ko có name
    acc[name] = dependentValuesArray ? dependentValuesArray[index] : undefined;
    return acc;
  }, {} as Record<string, any>);

  return fields?.map((field) => {
    if (field.hidden) return null;

    // Check conditional rendering
    if (field.dependsOn) {
      const { field: dependField, value: expectedValue } = field.dependsOn;
      // Fallback: useWatch value → initial data value
      // const currentValue = formValues[dependField] ?? data[dependField]; // Old way
      const currentValue = dependentValues
        ? dependentValues[dependField] ?? data[dependField]
        : data[dependField]; // Use dependentValues

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
      multipleFields.forEach((subField) => {
        control.register(subField, {
          value: data[subField] ?? input.defaultValue?.[subField],
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
        name={key} // Form data sử dụng key
        control={control}
        rules={validation}
        defaultValue={data[key] || input.defaultValue}
        render={({ field: fieldProps, fieldState }) => (
          <InputComponent
            {...fieldProps}
            name={propname} // HTML attribute dùng propname
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
