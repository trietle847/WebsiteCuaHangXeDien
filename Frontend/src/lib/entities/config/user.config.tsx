import type { EntityConfig } from "./types";
import userApi from "../../../services/user.api";
import { userFormConfig } from "../form/user.form";
import { Box, Tooltip, IconButton, DialogContentText } from "@mui/material";
import { Edit, LockOpen, LockPerson, Delete } from "@mui/icons-material";

export const userConfig: EntityConfig = {
  name: "users",
  idKey: "user_id",
  label: "Khách hàng",
  permission: {
    create: false,
    update: true,
    delete: true,
  },
  getColumns: ({ onEdit, onDelete, onView } = {}) => [
    {
      field: "full_name",
      headerName: "Họ tên",
      width: 200,
      renderCell: (params) =>
        `${params.row.last_name} ${params.row.first_name}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 200,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 150,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
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
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          {userConfig.permission.update && onEdit && (
            <Tooltip title="Chỉnh sửa">
              <IconButton
                sx={{
                  "&:hover": {
                    color: "blue",
                  },
                }}
                onClick={() => onEdit(params.row)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          {params.row.status === "banned" && (
            <Tooltip title="Mở khóa">
              <IconButton
                onClick={() => {
                  if (onView) {
                    onView({
                      title: "Xác nhận kích hoạt tài khoản",
                      content: (
                        <DialogContentText>
                          Bạn có chắc chắn muốn kích hoạt tài khoản này không?
                        </DialogContentText>
                      ),
                      id: params.row.user_id,
                      quickUpdate: async (id: number) => {
                        return await userApi.activate(id);
                      },
                    });
                  }
                }}
              >
                <LockOpen
                  sx={{
                    "&:hover": {
                      color: "green",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          {params.row.status === "active" && (
            <Tooltip title="Vô hiệu hóa">
              <IconButton
                onClick={() => {
                  if (onView) {
                    onView({
                      title: "Xác nhận vô hiệu hóa tài khoản",
                      content: (
                        <DialogContentText>
                          Bạn có chắc chắn muốn vô hiệu hóa tài khoản này không?
                        </DialogContentText>
                      ),
                      id: params.row.user_id,
                      quickUpdate: async (id: number) => {
                        return await userApi.deactivate(id);
                      },
                    });
                  }
                }}
              >
                <LockPerson
                  sx={{
                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          {userConfig.permission.delete && onDelete && (
            <Tooltip title="Xóa">
              <IconButton
                sx={{
                  "&:hover": {
                    color: "red",
                  },
                }}
                onClick={() => onDelete(params.row)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ],
  api: userApi,
  customFormComponents: null,
  formConfig: userFormConfig,
};
