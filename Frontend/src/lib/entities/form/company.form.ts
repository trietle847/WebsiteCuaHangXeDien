import companyApi from "../../../services/company.api";
import { attr, defineConfig } from "./formConfig";
import { text, textValidation } from "./inputConfig";

const company = [
  attr("name", "Hãng xe", text(), {
    required: true,
    validation: textValidation.length(1, 100),
  }),
  attr("address", "Địa chỉ", text(), {
    required: true,
    validation: textValidation.length(0, 200),
  }),
];

export const companyFormConfig = defineConfig(
  "companies",
  "Hãng xe",
  companyApi,
  company
);
