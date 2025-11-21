import type { EntityConfig } from "./types";
import serviceTicketApi from "../../../services/serviceTicket.api";
import { Box, Tooltip, Chip } from "@mui/material";
import type { ServiceTicket, Vehicle } from "../../types";
import { format, addHours } from "date-fns";
import ServiceForm from "../../../components/form/Service/ServiceForm";
import ServiceAction from "../../../components/ServiceAction";
import { getStatusContent } from "../../../components/ServiceAction";
import ServiceSelectionActions from "../../../components/ServiceSelectionAction";

export const serviceTicketConfig: EntityConfig = {
  name: "services",
  idKey: "serviceTicket_id",
  label: "Dịch vụ",
  permission: {
    create: true,
    update: true,
    delete: false,
  },
  selectContent: () => <ServiceSelectionActions />,
  getColumns: ({ onView } = {}) => [
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
      field: "Vehicle",
      headerName: "Xe",
      width: 150,
      renderCell: (params) => {
        const vehicle: Vehicle = params.row.Vehicle;
        if (!vehicle) return "N/A";
        return (
          <Tooltip title={`Số khung: ${vehicle?.vin}`}>
            <Box>
              {vehicle?.ProductColor?.Product?.name || "N/A"}{" "}
              {vehicle?.ProductColor?.Color?.name || "N/A"}
            </Box>
          </Tooltip>
        );
      },
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
        return (
          <Chip
            label={getStatusContent(status).text}
            color="primary"
            sx={{
              backgroundColor: getStatusContent(status).color,
              color: "white",
            }}
          />
        );
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
      field: "mechanic_id",
      headerName: "Kỹ thuật viên",
      width: 200,
      renderCell: (params) => {
        const mechanic = params.row.Mechanic;
        return mechanic ? (
          `${mechanic.last_name || ""} ${mechanic.first_name || ""}`
        ) : (
          <em>Chưa phân công</em>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ServiceAction row={params.row} onView={onView} />
      ),
    },
  ],
  api: serviceTicketApi,
  customFormComponents: () => <ServiceForm />,
};
