import type { EntityConfig } from "./types";
import serviceTicketApi from "../../../services/serviceTicket.api";
import {
  Box,
  Tooltip,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { Edit, Add, Delete } from "@mui/icons-material";
import type { ServiceTicket, Vehicle } from "../../types";
import { format, addHours } from "date-fns";
import ServiceForm from "../../../components/form/Service/ServiceForm";
import {
  Controller,
  useForm,
  useFormContext,
  useWatch,
  useFieldArray,
  type UseFormReturn,
} from "react-hook-form";
import type { JSX } from "react";
import { NumericFormat } from "react-number-format";
import MechanicsSelect from "../../../components/inputs/MechanicsSelect";
import { useAuth } from "../../../context/AuthContext";

interface StatusContent {
  text: string;
  color: string;
}

function getStatusContent(status: ServiceTicket["status"]): StatusContent {
  switch (status) {
    case "pending":
      return {
        text: "Chờ xác nhận",
        color: "#FFD600",
      };
    case "confirmed":
      return {
        text: "Đã xác nhận",
        color: "#1976D2",
      };
    case "inProgress":
      return {
        text: "Đang thực hiện",
        color: "orange",
      };
    case "completed":
      return {
        text: "Hoàn thành",
        color: "green",
      };
    case "closed":
      return {
        text: "Đã đóng",
        color: "grey",
      };
    case "expired":
      return {
        text: "Hết hạn",
        color: "darkred",
      };
    case "cancelled":
      return {
        text: "Đã hủy",
        color: "red",
      };
    case "noShow":
      return {
        text: "Không đến",
        color: "grey",
      };
    default:
      return {
        text: "N/A",
        color: "grey",
      };
  }
}

const availableUpdateStatuses: ServiceTicket["status"][] = [
  "pending",
  "confirmed",
  "inProgress",
  "completed",
];

const statusFlow: Record<ServiceTicket["status"], ServiceTicket["status"][]> = {
  pending: ["confirmed", "inProgress", "cancelled", "noShow"],
  confirmed: ["inProgress", "cancelled", "noShow"],
  inProgress: ["completed", "cancelled"],
  completed: ["closed"],
  expired: [],
  closed: [],
  cancelled: [],
  noShow: [],
};

const detailField = [
  {
    key: "content",
    label: "Nội dung",
    required: true,
  },
  {
    key: "price",
    label: "Giá",
    custom: ({ onChange, ...props }: any) => (
      <NumericFormat
        {...props}
        required
        error={props.error}
        helperText={props.helperText}
        // React Hook Form truyền value, nếu null/undefined thì fallback về ""
        value={props.value ?? ""}
        // Xử lý logic update giá trị
        onValueChange={(values) => {
          // Chỉ gửi giá trị số (floatValue) về form
          // Nếu user xóa hết thì gửi null hoặc undefined
          onChange(values.floatValue ?? undefined);
        }}
        thousandSeparator=","
        suffix=" đ"
        decimalScale={0}
        allowNegative={false}
        customInput={TextField}
        getInputRef={props.ref}
      />
    ),
  },
  {
    key: "note",
    label: "Ghi chú",
    type: "multiline",
    required: false,
  },
];

function UpdateTicket({ row }: { row: ServiceTicket }) {
  console.log("UpdateTicket row:", row);
  const status = row.status as ServiceTicket["status"];
  const type = row.type as ServiceTicket["type"];
  const { control, setValue } = useFormContext();
  const newStatus = useWatch({ control, name: "status" });
  const { userInfo } = useAuth();
  if(userInfo?.role==="mechanic"){
    setValue("mechanic_id",userInfo.user_id);
  }
  const requiredMechanic = status === "confirmed" && newStatus === "inProgress";
  const showMechanic =
    ["pending", "confirmed"].includes(status) &&
    ["confirmed", "inProgress"].includes(newStatus) &&
    userInfo?.role !== "mechanic";
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });
  const currentDetails = row.ServiceDetails || [];
  return (
    <Box
      sx={{
        mt: 2,
        width: {
          xs: 350,
          sm: 400,
          md: 500,
        },
      }}
    >
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <TextField select {...field} fullWidth label="Trạng thái mới">
            <MenuItem value={status} disabled>
              {getStatusContent(status).text} (Hiện tại)
            </MenuItem>
            {statusFlow[status].map((s) => (
              <MenuItem key={s} value={s}>
                {getStatusContent(s).text}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            sx={{ mt: 2 }}
            fullWidth
            label="Mô tả"
            multiline
            rows={3}
          />
        )}
      />
      {status === "pending" &&
        ["confirmed", "inProgress"].includes(newStatus) && (
          <Controller
            name="mileage_at_check_in"
            control={control}
            rules={{
              min: {
                value: 0,
                message: "Giá trị nhỏ nhất là 0",
              },
              required: "Vui lòng nhập số km hiện tại",
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                sx={{ mt: 2 }}
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                label="Số km hiện tại"
                type="number"
              />
            )}
          />
        )}
      {showMechanic && (
        <Controller
          name="mechanic_id"
          control={control}
          rules={{
            required: {
              value: requiredMechanic,
              message: "Vui lòng chọn kỹ thuật viên",
            },
          }}
          render={({ field, fieldState }) => (
            <Box sx={{ mt: 2 }}>
              <MechanicsSelect
                {...field}
                required={requiredMechanic}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            </Box>
          )}
        />
      )}
      {newStatus === "completed" && (
        <Box sx={{ mt: 2, border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Chi tiết{" "}
              {type === "maintenance"
                ? "bảo dưỡng"
                : type === "repair"
                ? "sửa chữa"
                : type === "warranty"
                ? "bảo hành"
                : "dịch vụ"}
            </Typography>
            <Tooltip title="Thêm chi tiết">
              <IconButton
                onClick={() => append({ content: "", price: "", note: "" })}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {currentDetails &&
              currentDetails.length > 0 &&
              currentDetails.map((detail, detailIdx) => (
                <Box
                  key={detailIdx}
                  sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}
                >
                  {detailField.map((df) => {
                    const CustomComponent = df.custom;
                    if (CustomComponent) {
                      return (
                        <CustomComponent
                          key={df.key}
                          value={detail[df.key as keyof typeof detail] || ""}
                          label={df.label}
                          required={df.required}
                          disabled
                        />
                      );
                    } else {
                      return (
                        <TextField
                          key={df.key}
                          value={detail[df.key as keyof typeof detail] || ""}
                          label={df.label}
                          required={df.required}
                          disabled
                        />
                      );
                    }
                  })}
                </Box>
              ))}
            {fields.map((fieldInput, index) => (
              <Box key={fieldInput.id}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  {detailField.map((df) => (
                    <Controller
                      key={df.key}
                      name={`details.${index}.${df.key}`}
                      control={control}
                      render={({ field, fieldState }) => {
                        if (df.custom) {
                          const CustomComponent = df.custom;
                          return (
                            <CustomComponent
                              {...field}
                              required
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              label={df.label}
                            />
                          );
                        } else {
                          return (
                            <TextField
                              {...field}
                              required={df.required}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              label={df.label}
                            />
                          );
                        }
                      }}
                    />
                  ))}
                  <IconButton onClick={() => remove(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

function ActionsCell({
  row,
  onView,
}: {
  row: any;
  onView?: (element?: {
    title: string;
    content: JSX.Element | null;
    quickUpdate?: (id: number, data?: any) => Promise<any>;
    id?: number;
    formMethods?: UseFormReturn<any>;
  }) => void;
}) {
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      status: row.status,
      description: row.description || "",
      mechanic_id: row.mechanic_id || null,
      mileage_at_check_in: row.mileage_at_check_in || "",
      details: [], // Luôn là nội dung mới nên không lấy từ row
    },
  });
  const canUpdate =
    !!onView &&
    availableUpdateStatuses.includes(row.status as ServiceTicket["status"]);

  return (
    <Box>
      {canUpdate && (
        <Tooltip title="Cập nhật phiếu dịch vụ">
          <IconButton
            sx={{
              "&:hover": {
                color: "blue",
              },
            }}
            onClick={() =>
              onView?.({
                title: "Cập nhật phiếu dịch vụ",
                content: <UpdateTicket row={row} />,
                formMethods: methods as unknown as UseFormReturn<any>,
                quickUpdate: async (id: number, data?: any) => {
                  if (data.mileage_at_check_in === "") {
                    data.mileage_at_check_in = null;
                  } else {
                    // Đảm bảo nó là số (phòng trường hợp input type="number" trả về string)
                    data.mileage_at_check_in = Number(data.mileage_at_check_in);
                  }
                  return await serviceTicketApi.update(id, data || {});
                },
                id: row.serviceTicket_id,
              })
            }
          >
            <Edit />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export const serviceTicketConfig: EntityConfig = {
  name: "services",
  idKey: "serviceTicket_id",
  label: "Dịch vụ",
  permission: {
    create: true,
    update: true,
    delete: false,
  },
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
      renderCell: (params) => <ActionsCell row={params.row} onView={onView} />,
    },
  ],
  api: serviceTicketApi,
  customFormComponents: () => <ServiceForm />,
};
