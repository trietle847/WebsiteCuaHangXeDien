import type { EntityConfig } from "../types";
import userApi from "../../../services/user.api";
import { userFormConfig } from "../form/user.form";

export const userConfig: EntityConfig = {
    name: "users",
    idKey: "user_id",
    label: "Khách hàng",
    permission: {
        create: false,
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
        // actionColumn({ onEdit, onDelete, permission: { update: true, delete: false } }),
    ],
    api: userApi,
    customFormComponents: null,
    formConfig: userFormConfig,
}