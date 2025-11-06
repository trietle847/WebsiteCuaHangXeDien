import type { InputConfig, ValidationRules } from "./inputConfig";
import apiClient from "../../../services/axios";

export interface FieldConfig {
  key: string; // "first_name" - key trong data object
  propname: string; // "user_first_name" - name attribute trong HTML
  label: string;
  input: InputConfig;
  validation?: ValidationRules;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  dependsOn?: {
    field: string; // Tên field cần theo dõi
    value: any; // Giá trị để hiển thị field này
  };
}

// ✅ Attr function với auto-generate propname
export const attr = (
  key: string,
  label: string,
  input: InputConfig,
  options?: {
    required?: boolean;
    validation?: ValidationRules;
    disabled?: boolean;
    hidden?: boolean;
    dependsOn?: { field: string; value: any }; // Thêm dependsOn
  }
): Omit<FieldConfig, "propname"> => {
  // Không có propname ở đây
  const { required, validation, dependsOn, ...restOptions } = options || {};

  const mergedValidation = {
    ...(input.validation || {}),
    ...(validation || {}),
  };

  if (required && !mergedValidation.required) {
    mergedValidation.required = `${label} là bắt buộc`;
  }

  if ("pattern" in mergedValidation && mergedValidation.pattern) {
    const pattern = mergedValidation.pattern;

    // Pattern có thể là { value: RegExp, message: string } hoặc RegExp trực tiếp
    if (typeof pattern === "object" && "value" in pattern) {
      // Validate pattern.value phải là RegExp
      if (!(pattern.value instanceof RegExp)) {
        console.warn(
          `Invalid pattern.value for field "${key}":`,
          pattern.value
        );
        delete mergedValidation.pattern;
      }
    } else if (!(pattern instanceof RegExp)) {
      console.warn(`Invalid pattern for field "${key}":`, pattern);
      delete mergedValidation.pattern;
    }
  }
  if (
    "valueAsDate" in mergedValidation &&
    typeof mergedValidation.valueAsDate !== "undefined" &&
    mergedValidation.valueAsDate !== false
  ) {
    delete mergedValidation.valueAsDate;
  }

  return {
    key,
    label,
    input,
    validation: mergedValidation as ValidationRules,
    required,
    dependsOn, // Thêm vào return
    ...restOptions,
  };
};

// Helper để add propname prefix
const withPropName = (
  prefix: string,
  fields: Omit<FieldConfig, "propname">[]
): FieldConfig[] => {
  return fields.map((field) => ({
    ...field,
    propname: `${prefix}_${field.key}`, // user_first_name
  }));
};

// Define config
export const defineConfig = (
  name: string, // "user", "staff", "product"
  label: string,
  api: apiClient,
  baseFields: ReturnType<typeof attr>[],
  options?: {
    createFields?: ReturnType<typeof attr>[];
    updateFields?: ReturnType<typeof attr>[];
  }
) => {
  return {
    name,
    label,
    api,
    // Auto add propname prefix
    fields: withPropName(name, baseFields),
    createFields: withPropName(name, [
      ...baseFields,
      ...(options?.createFields || []),
    ]),
    updateFields: withPropName(name, [
      ...baseFields,
      ...(options?.updateFields || []),
    ]),
  };
};
