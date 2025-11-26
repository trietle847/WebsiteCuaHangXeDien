import { attr, defineConfig } from "./formConfig";
import { text, select ,textValidation, option } from "./inputConfig";
import staffApi from "../../../services/staff.api";

const staffBase = [
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
  attr("address", "Địa chỉ", text(), {
    required: true,
    validation: textValidation.length(0, 200),
  }),
  attr("role", "Vai trò", select([
    option("sale_staff", "Tư vấn bán hàng"),
    option("store_keeper", "Kho vận"),
    option("mechanic", "Kỹ thuật viên"),
  ]), {
    required: true,
  })
]

export const staffFormConfig = defineConfig(
    "users",
    "Người dùng",
    staffApi,
    staffBase
);