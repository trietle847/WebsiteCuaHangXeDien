import type { EntityConfig } from "./types";
import commentApi from "../../../services/comment.api";
import { IconButton, Box, DialogContentText, Tooltip } from "@mui/material";
import { RemoveRedEye, VisibilityOff } from "@mui/icons-material";
import {format} from "date-fns/format";

export const commentConfig: EntityConfig = {
  name: "comments",
  idKey: "feedback_id",
  label: "Bình luận",
  permission: {
    create: false,
    update: false,
    delete: false,
  },
  getColumns: ({ onView } = {}) => [
    {
      field: "fullName",
      headerName: "Họ tên",
      width: 150,
      renderCell: (params) =>
        params.row
          ? `${params.row.User?.last_name ?? ""} ${
              params.row.User?.first_name ?? ""
            }`.trim()
          : "",
    },
    {
      field: "content",
      headerName: "Nội dung",
      width: 300,
    },
    {
      field: "product",
      headerName: "Sản phẩm",
      width: 300,
      renderCell: (params) => params.row.Product?.name,
    },
    {
      field: "createdAt",
      headerName: "Ngày đăng",
      width: 300,
      renderCell: (params) =>
        params.row ? format(new Date(params.row?.createdAt), "dd/MM/yyyy HH:mm:ss") : "",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title={params.row.status ? "Ẩn" : "Hiện"}>
            <IconButton
              onClick={() => {
                if (!onView) return;
                onView({
                  id: params.row.feedback_id,
                  title: params.row.status
                    ? "Xác nhận ẩn bình luận"
                    : "Xác nhận hiện bình luận",
                  content: (
                    <DialogContentText>
                      {params.row.status
                        ? "Bạn có muốn ẩn bình luận này không?"
                        : "Bạn có muốn hiện bình luận này không?"}
                    </DialogContentText>
                  ),
                  quickUpdate: async (id: number) => {
                    if (params.row.status) {
                      await commentApi.deactivate(id);
                    } else {
                      await commentApi.activate(id);
                    }
                    return true;
                  },
                });
              }}
            >
              {params.row.status ? (
                <RemoveRedEye sx={{ "&:hover": { color: "green" } }} />
              ) : (
                <VisibilityOff sx={{ "&:hover": { color: "red" } }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ],
  api: commentApi,
  customFormComponents: null,
};
