import type { EntityConfig } from "./types";
import serviceTicketApi from "../../../services/serviceTicket.api";
import { Box, Tooltip, IconButton, DialogContentText } from "@mui/material";
import { Edit, LockOpen, LockPerson, Delete } from "@mui/icons-material";
import type { ServiceTicket } from "../../types";
import { format, addHours } from "date-fns";

export const statusMap: Record<ServiceTicket["status"], string> = {
  pending: "Đang chờ",
  inProgress: "Đang tiến hành",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  confirmed: "Đã xác nhận",
  closed: "Đã đóng",
  expired: "Hết hạn",
  noShow: "Không đến",
};

export const serviceTicketConfig: EntityConfig = {
  name: "services",
  idKey: "serviceTicket_id",
  label: "Dịch vụ",
  permission: {
    create: true,
    update: true,
    delete: false,
  },
  getColumns: ({ onEdit, onView } = {}) => [
    {
      field: "serviceTicket_id",
      headerName: "Mã phiếu",
      width: 100,
    },
    {
      field: "Customer",
      headerName: "Khách hàng",
      width: 200,
      renderCell: (params) =>
        `${params.row.Customer?.last_name} ${params.row.Customer?.first_name}`,
    },
    {
      field: "type",
      headerName: "Loại dịch vụ",
      width: 150,
      renderCell: (params) => {
        switch (params.row.type) {
          case "maintenance":
            return "Bảo dưỡng";
          case "repair":
            return "Sửa chữa";
          case "warranty":
            return "Bảo hành";
          default:
            return "N/A";
        }
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => {
        const status = params.row.status as ServiceTicket["status"];
        return statusMap[status];
      },
    },
    {
      field: "confirmed_date_time",
      headerName: "Thời gian chốt hẹn",
      width: 200,
      renderCell: (params) => {
        const dateTime = params.row.confirmed_date_time;
        const expected_date = params.row.expected_date;
        return dateTime
          ? `${format(new Date(dateTime), "dd/MM/yyyy HH")}-${format(
              addHours(new Date(dateTime), 1),
              "HH"
            )}`
          : expected_date
          ? `Dự kiến: ${format(new Date(expected_date), "dd/MM/yyyy")}`
          : "Chưa có";
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
          {serviceTicketConfig.permission.update && onEdit && (
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
        </Box>
      ),
    },
  ],
  api: serviceTicketApi,
  customFormComponents: null,
};
