import { text, type InputProps, type ValidationRules } from "./inputConfig";
import apiClient from "../../../services/axios";

export const attr = (
  key: string,
  label: string,
  input: InputProps = text(),
  required?: boolean,
  rules?: ValidationRules
) => {
  const validation: ValidationRules = { ...(rules || {}) };

  // Nếu required = true, tự động thêm message "label + là bắt buộc"
  if (required) {
    validation.required = `${label} là bắt buộc`;
  }

  return {
    key,
    label,
    input,
    validation,
  };
};

export const defineConfig = (
  objectName: string,
  objectLabel: string,
  api: apiClient,
  baseAttributes: ReturnType<typeof attr>[],
  createAttributes: ReturnType<typeof attr>[] = [],
  updateAttributes: ReturnType<typeof attr>[] = []
) => {
  // Hàm gán propName cho từng attr
  const withPropName = (attrs: ReturnType<typeof attr>[]) =>
    attrs.map((attr) => ({
      ...attr,
      propname: `${objectName}_${attr.key}`,
    }));

  // Config mặc định (dùng base nếu không có create/update riêng)
  const config = withPropName([...baseAttributes]);

  // Config cho create: base + createAttributes
  const createConfig = withPropName([...baseAttributes, ...createAttributes]);

  // Config cho update: base + updateAttributes
  const updateConfig = withPropName([...baseAttributes, ...updateAttributes]);

  return {
    name: objectName,
    label: objectLabel,
    config, // Config chung (base only)
    createConfig, // Config cho create
    updateConfig, // Config cho update
    api,
  };
};
