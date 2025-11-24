import { attr, defineConfig } from "./formConfig";
import { text ,textValidation } from "./inputConfig";
import userApi from "../../../services/user.api";

const userBase = [
  attr("email", "Email", text("email"), {
    required: true,
    validation: textValidation.email(),
  }),
  attr("phone", "Số điện thoại", text("text"), {
    required: true,
    validation: textValidation.phone(),
  }),
  attr("last_name", "Họ", text(), {
    required: true,
    validation: textValidation.name(1, 50),
  }),
  attr("first_name", "Tên", text(), {
    required: true,
    validation: textValidation.name(1, 50),
  }),
];

export const userFormConfig = defineConfig(
    "users",
    "Người dùng",
    userApi,
    userBase
);