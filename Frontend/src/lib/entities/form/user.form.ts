import { attr, defineConfig } from "./formConfig";
import { text ,textValidation } from "./inputConfig";
import userApi from "../../../services/user.api";

const userBase = [
    attr("username", "Tên đăng nhập", text(), true, textValidation.name(3, 50)),
    attr("email", "Email", text("email"), true, textValidation.email()),
    attr("phone", "Số điện thoại", text("text"), false, textValidation.phone()),
    attr("first_name", "Tên", text(), true, textValidation.name(1, 50)),
    attr("last_name", "Họ", text(), true, textValidation.name(1, 50)),
]

export const userFormConfig = defineConfig(
    "users",
    "Người dùng",
    userApi,
    userBase
);