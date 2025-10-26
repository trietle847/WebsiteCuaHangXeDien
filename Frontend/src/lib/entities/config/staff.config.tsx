import type { EntityConfig } from "./types";
import staffApi from "../../../services/staff.api";
import { staffFormConfig } from "../form/staff.form";

export const staffConfig: EntityConfig = {
  name: "staffs",
  idKey: "user_id",
  label: "Nhân viên",
  permission: {
    create: true,
    update: true,
    delete: false,
  },
  getColumns: () => [
    {
      field: "last_name",
      headerName: "Họ lót",
      flex: 1,
    },
    {
      field: "first_name",
      headerName: "Tên",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Vai trò",
      flex: 1,
      renderCell: (params) => {
        switch (params.row.role) {
          case "sale_staff":
            return "Nhân viên bán hàng";
          case "mechanic":
            return "Thợ sửa chữa";
          case "store_keeper":
            return "Nhân viên kho";
          default:
            return "N/A";
        }
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params) => {
        switch (params.row.status) {
          case "active":
            return "Hoạt động";
          case "inactive":
            return "Chưa kích hoạt";
          case "banned":
            return "Bị khóa";
          default:
            return "N/A";
        }
      },
    },
    // actionColumn({ onEdit, onDelete, permission: { update: true, delete: false } }),
  ],
  api: staffApi,
  customFormComponents: null,
  formConfig: staffFormConfig,
};
