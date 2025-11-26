import serviceTicketApi from "../services/serviceTicket.api";
import {
  Box,
  Tooltip,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  List,
} from "@mui/material";
import { Edit, Add, Delete, Visibility } from "@mui/icons-material";
import type { ServiceTicket } from "../lib/types";
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
import MechanicsSelect from "./inputs/MechanicsSelect";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns/format";

interface StatusContent {
  text: string;
  color: string;
}

export function getStatusContent(
  status: ServiceTicket["status"]
): StatusContent {
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

const allTimeKeys = [
  {
    field: "expected_date",
    label: "Ngày dự kiến",
  },
  {
    field: "confirmed_date_time",
    label: "Thời gian chốt hẹn",
  },
  {
    field: "check_in_time",
    label: "Thời gian check-in",
  },
  {
    field: "completed_time",
    label: "Thời gian hoàn thành",
  },
];

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
        thousandSeparator="."
        decimalSeparator=","
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

export function UpdateTicket({ row }: { row: ServiceTicket }) {
  const status = row.status as ServiceTicket["status"];
  const type = row.type as ServiceTicket["type"];
  const { control, setValue } = useFormContext();
  const newStatus = useWatch({ control, name: "status" });
  const { userInfo } = useAuth();
  if (
    userInfo?.role === "mechanic" &&
    newStatus !== "pending" &&
    (row.mechanic_id === null || row.mechanic_id === undefined)
  ) {
    setValue("mechanic_id", userInfo.user_id);
  }
  const requiredMechanic = status === "confirmed" && newStatus === "inProgress";
  const showMechanic =
    ["pending", "confirmed", "inProgress"].includes(status) &&
    ["confirmed", "inProgress"].includes(newStatus);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });
  const serviceDetails = useWatch({
    control,
    name: "details",
  });
  const subTotal =
    serviceDetails?.reduce(
      (sum: number, detail: any) =>
        sum + (detail.price ? Number(detail.price) : 0),
      0
    ) || 0;
  const currentDetails = row.ServiceDetails || [];
  return (
    <Box
      sx={{
        mt: 2,
        width: {
          xs: 350,
          sm: 400,
          md: 600,
        },
      }}
    >
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <TextField select {...field} fullWidth label="Trạng thái mới">
            <MenuItem value={status}>
              {getStatusContent(status).text} (Hiện tại)
            </MenuItem>
            {statusFlow[status].map((s) => {
              if (s === "cancelled" && userInfo?.role === "mechanic") {
                return null;
              }
              return (
                <MenuItem key={s} value={s}>
                  {getStatusContent(s).text}
                </MenuItem>
              );
            })}
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
                disabled={userInfo?.role === "mechanic"}
                required={requiredMechanic}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            </Box>
          )}
        />
      )}
      {["completed", "closed"].includes(newStatus) && (
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
          {row.total_price ? (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Tổng giá trị hiện tại:{" "}
              <NumericFormat
                value={Number(row.total_price) + subTotal}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Tổng trị giá tạm tính:{" "}
              <NumericFormat
                value={subTotal}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            </Typography>
          )}
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

export default function ServiceAction({
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
  const { userInfo } = useAuth();
  const hasPermissionToUpdate =
    ["sale_staff", "admin"].includes(userInfo?.role || "") ||
    (userInfo?.role === "mechanic" &&
      row.mechanic_id === userInfo.user_id &&
      row.status === "inProgress");

  const canUpdate =
    !!onView &&
    availableUpdateStatuses.includes(row.status as ServiceTicket["status"]) &&
    hasPermissionToUpdate;

  const ticket = row as ServiceTicket;
  const customer = ticket.Customer;
  const vehicle = ticket.Vehicle;
  const mechanic = ticket.Mechanic;
  const details = ticket.ServiceDetails;

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
      {["sale_staff", "admin"].includes(userInfo?.role || "") && (
        <Tooltip title="Xem chi tiết phiếu dịch vụ">
          <IconButton
            sx={{
              "&:hover": {
                color: "green",
              },
            }}
            onClick={() =>
              onView?.({
                title: "Chi tiết phiếu dịch vụ",
                content: (
                  <Box
                    sx={{
                      maxWidth: 600,
                    }}
                  >
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Thông tin tiếp nhận
                      </Typography>
                      <Typography>
                        Khách hàng:{" "}
                        {customer
                          ? `${customer.last_name} ${customer.first_name}`
                          : "N/A"}
                      </Typography>
                      <Typography>
                        Xe:{" "}
                        {vehicle
                          ? `${vehicle.ProductColor?.Product?.name || "N/A"} ${
                              vehicle.ProductColor?.Color?.name || "N/A"
                            }`
                          : "N/A"}{" "}
                        - Số khung: {vehicle?.vin || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Thông tin dịch vụ
                      </Typography>
                      <Typography>
                        Loại dịch vụ:{" "}
                        {ticket.type === "maintenance"
                          ? "Bảo dưỡng"
                          : ticket.type === "repair"
                          ? "Sửa chữa"
                          : ticket.type === "warranty"
                          ? "Bảo hành"
                          : "..."}
                      </Typography>
                      <Typography>
                        Kỹ thuật viên:{" "}
                        {mechanic
                          ? `${mechanic.last_name} ${mechanic.first_name}`
                          : "Chưa phân công"}
                      </Typography>
                      <Typography>
                        Số km lúc tiếp nhận:{" "}
                        {row?.mileage_at_check_in
                          ? `${row?.mileage_at_check_in} km`
                          : "Chưa cập nhật"}
                      </Typography>
                      <Typography>
                        Mô tả: {row?.description || "Chưa có mô tả"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Chi tiết dịch vụ
                      </Typography>
                      {details && details.length > 0 ? (
                        <Box>
                          {details.map((detail, index) => (
                            <Typography key={index} variant="subtitle2">
                              {detail.content} -{" "}
                              {Math.round(detail.price) === 0 ? (
                                "Miễn phí"
                              ) : (
                                <NumericFormat
                                  value={detail.price}
                                  displayType="text"
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  suffix=" đ"
                                />
                              )}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="subtitle2">
                          Cập nhật sau
                        </Typography>
                      )}
                      {ticket.total_price && (
                        <Typography variant="body1">
                          Tổng:{" "}
                          <NumericFormat
                            value={ticket.total_price}
                            displayType="text"
                            thousandSeparator="."
                            decimalSeparator=","
                            suffix=" đ"
                          />
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Các mốc thời gian ghi nhận:
                      </Typography>
                      <List>
                        {allTimeKeys.map((timeKey) => {
                          const timeValue = row[timeKey.field];
                          if (!timeValue) return null;
                          const formattedTime = format(
                            new Date(timeValue),
                            "dd/MM/yyyy HH:mm"
                          );
                          return (
                            <Typography key={timeKey.field} variant="subtitle1">
                              {timeKey.label}: {formattedTime}
                            </Typography>
                          );
                        })}
                      </List>
                    </Box>
                  </Box>
                ),
              })
            }
          >
            <Visibility />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
