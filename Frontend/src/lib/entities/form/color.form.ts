import { attr, defineConfig } from "./formConfig";
import {
  text,
  textValidation,
  color
} from "./inputConfig";
import colorApi from "../../../services/color.api";

const colorBase = [
  attr("name", "Tên màu", text(), true, textValidation.name(1, 50)),
  attr("code", "Mã màu", color(), true),
];

export const colorFormConfig = defineConfig(
  "colors",
  "Màu sắc",
  colorApi,
  colorBase
);
