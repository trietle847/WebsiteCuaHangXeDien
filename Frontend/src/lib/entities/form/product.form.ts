import { attr, defineConfig } from "./formConfig";
import { text, selectManage, uploadFile, updateFile ,textValidation } from "./inputConfig";
import productApi from "../../../services/product.api";
import companyApi from "../../../services/company.api";

const company = [
  attr("name", "Hãng xe", text(), true, textValidation.name(3, 100)),
  attr("address", "Địa chỉ", text(), true, textValidation.length(0, 200)),
];

export const companyFormConfig = defineConfig(
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
  attr("company_id", "Hãng xe", selectManage(companyFormConfig, "name"), true),
];

const productCreate = [
  attr("images", "Hình ảnh", uploadFile(true, 4, 150, 10), true),
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