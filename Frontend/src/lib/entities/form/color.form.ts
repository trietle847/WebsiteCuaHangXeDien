import { attr, defineConfig } from "./formConfig";
import {
  text,
  textValidation,
  color
} from "./inputConfig";
import colorApi from "../../../services/color.api";

const colorBase = [
  attr("name", "Tên màu", text(), {
    required: true,
    validation: textValidation.length(1, 100),
  }),
  attr("code", "Mã màu", color(), {
    required: true,
  }),
];

export const colorFormConfig = defineConfig(
  "colors",
  "Màu sắc",
  colorApi,
  colorBase,
  {
    dialogSize: "sm",
  }
);
