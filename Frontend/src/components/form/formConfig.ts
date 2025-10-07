import { text, uploadFile, updateFile, selectManage } from "../inputs/inputConfig";
import companyApi from "../../services/company.api";
import apiClient from "../../services/axios";
import productApi from "../../services/product.api";
import type { InputProps, ValidationRules } from "../inputs/inputConfig";
import { textValidation } from "../inputs/inputConfig";

const attr = (
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
  // Config mặc định (dùng base nếu không có create/update riêng)
  const config = [...baseAttributes];

  // Config cho create: base + createAttributes
  const createConfig = [
    ...baseAttributes,
    ...createAttributes.filter(
      (attr) => !baseAttributes.find((baseAttr) => baseAttr.key === attr.key)
    ),
  ];

  // Config cho update: base + updateAttributes
  const updateConfig = [
    ...baseAttributes,
    ...updateAttributes.filter(
      (attr) => !baseAttributes.find((baseAttr) => baseAttr.key === attr.key)
    ),
  ];

  return {
    name: objectName,
    label: objectLabel,
    config, // Config chung (base only)
    createConfig, // Config cho create
    updateConfig, // Config cho update
    api,
  };
};

const company = [
  attr("name", "Hãng xe", text(), true, textValidation.name(3, 100)),
  attr("address", "Địa chỉ", text(), true, textValidation.length(0, 200)),
];

const companyFormConfig = defineConfig(
  "companies",
  "Hãng xe",
  companyApi,
  company
);

const productBase = [
  attr("name", "Tên sản phẩm", text(), true, textValidation.name(3, 100)),
  attr("price", "Giá", text("number"), true, textValidation.number(0)),
  attr(
    "stock_quantity",
    "Số lượng",
    text("number"),
    true,
    textValidation.number(0)
  ),
  attr(
    "specifications",
    "Thông số",
    text(),
    true,
    textValidation.length(0, 500)
  ),
  attr("company_id", "Hãng xe", selectManage(companyFormConfig, "name"),  true),
];

const productCreate = [
  attr("images", "Hình ảnh", uploadFile(true, 3, 80, 10), true),
];

const productUpdate = [
  attr(
    "images",
    "Hình ảnh",
    updateFile("image", 10, "url", "image_id", "newImages", "deleteImageIds"),
    true
  ),
];

export const productFormConfig = defineConfig(
  "products",
  "Sản phẩm",
  productApi,
  productBase,
  productCreate,
  productUpdate
);
