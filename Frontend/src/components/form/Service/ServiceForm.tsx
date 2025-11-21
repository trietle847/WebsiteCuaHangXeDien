import {
  Box,
  Button,
  Card,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ElectricMoped, CheckCircle, ArrowBack } from "@mui/icons-material";
import Autocomplete from "../../inputs/Autocomplete";
import { Controller, useForm } from "react-hook-form";
import userApi from "../../../services/user.api";
import type { Vehicle } from "../../../lib/types";
import vehicleApi from "../../../services/vehicle.api";
import serviceTicketApi from "../../../services/serviceTicket.api";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import MechanicsSelect from "../../inputs/MechanicsSelect";
import { useAuth } from "../../../context/AuthContext";

export default function ServiceForm() {
  const { control, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      customer: null,
      vehicle_id: null,
      type: "",
      mileage_at_check_in: "",
      description: "",
      confirmed_date_time: new Date(),
      check_in_time: new Date(),
      status: "inProgress",
      mechanic_id: null,
    },
  });

  const { userInfo } = useAuth();

  const check_in_info = [
    {
      label: "Loại dịch vụ",
      key: "type",
      value: "",
      type: "select",
      required: true,
      options: [
        {
          label: "Bảo dưỡng",
          value: "maintenance",
        },
        {
          label: "Sửa chữa",
          value: "repair",
        },
      ],
    },
    {
      label: "Số km hiện tại",
      key: "mileage_at_check_in",
      value: "",
      type: "number",
      required: true,
      min: 0,
    },
    {
      label: "Ghi chú tiếp nhận",
      key: "description",
      value: "",
      required: false,
    },
  ];

  const selectedCustomer = watch("customer") as any; // expects object with user_id
  const selectedCustomerId = selectedCustomer?.user_id as string | undefined;
  const selectedVehicleId = watch("vehicle_id");
  const serviceType = watch("type");

  const shouldFetchVehicles = !!selectedCustomerId;

  const { data } = useQuery({
    queryKey: ["customerVehicles", selectedCustomerId],
    queryFn: () => vehicleApi.findVehicleForCustomer(selectedCustomerId || ""),
    enabled: shouldFetchVehicles,
  });

  const queryClient = new QueryClient();

  const mutation = useMutation({
    mutationFn: (newServiceTicket: any) =>
      serviceTicketApi.create({
        ...newServiceTicket,
        customer_id: selectedCustomerId || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceTickets"] });
      alert("Tạo phiếu dịch vụ thành công!");
      reset();
    },
    onError: (error: any) => {
      alert(`Lỗi khi tạo phiếu dịch vụ: ${error.message}`);
    }
  });

  const { data: customerTickets } = useQuery({
    queryKey: ["customerTickets", selectedCustomerId],
    queryFn: () =>
      serviceTicketApi.getAll({
        keyword: `${selectedCustomer.last_name} ${selectedCustomer.first_name}`,
      }),
    enabled: shouldFetchVehicles,
  });

  const existedTickets = customerTickets?.data.filter(
    (ticket: any) =>
      ticket.type === serviceType &&
      (ticket.status === "pending" ||
        ticket.status === "confirmed" ||
        ticket.status === "inProgress") &&
      selectedVehicleId === ticket.vehicle_id
  );

  const vehicles: Vehicle[] = data?.data || [];

  const navigate = useNavigate();

  return (
    <Box>
      <Controller
        name="customer"
        control={control}
        rules={{
          required: "Vui lòng chọn khách hàng",
        }}
        render={({ field, fieldState }) => (
          <Autocomplete
            value={field.value}
            api={userApi}
            idKey="user_id"
            optionLabelKey={["email", "fullname"]}
            label="Chọn khách hàng"
            placeholder="Nhập tên hoặc email..."
            required
            objectName="user"
            error={!!fieldState.error}
            helperText={
              typeof fieldState.error?.message === "string"
                ? fieldState.error?.message
                : undefined
            }
            onChange={(user) => {
              field.onChange(user);
            }}
          />
        )}
      />
      {selectedCustomerId && (
        <Controller
          name="vehicle_id"
          control={control}
          rules={{
            required: "Vui lòng chọn xe",
          }}
          render={({ field, fieldState }) => (
            <Box
              sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              {vehicles && vehicles.length > 0 ? (
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={500}
                    color={fieldState.error ? "error.main" : "inherit"}
                  >
                    <ElectricMoped fontSize="large" /> Chọn xe *
                  </Typography>
                  {fieldState.error && (
                    <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      gap: 2,
                      overflowY: "auto",
                      maxHeight: {
                        xs: "300px",
                        sm: "400px",
                      },
                    }}
                  >
                    {vehicles.map((vehicle) => {
                      const isSelected =
                        vehicle.vehicle_id === selectedVehicleId;
                      return (
                        <Card
                          key={vehicle.vehicle_id}
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            // Logic Style khi được chọn
                            border: isSelected
                              ? "1px solid #1976d2"
                              : "1px solid #ccc",
                            bgcolor: isSelected
                              ? "rgba(33, 150, 243, 0.08)"
                              : "white", // blue[500] with opacity
                            "&:hover": {
                              borderColor: "primary.main",
                              boxShadow: 2,
                            },
                            mb: 2,
                          }}
                          onClick={() => field.onChange(vehicle.vehicle_id)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="h6"
                              gutterBottom
                              fontWeight={600}
                            >
                              {vehicle.ProductColor?.Product.name} (
                              {vehicle.ProductColor?.Color.name})
                            </Typography>
                            {isSelected && (
                              <CheckCircle
                                sx={{
                                  color: "#1976d2",
                                }}
                              />
                            )}
                          </Box>
                          <Typography>Số khung: {vehicle.vin}</Typography>
                          <Typography>
                            Ngày mua:{" "}
                            {format(new Date(vehicle.createdAt), "dd/MM/yyyy")}
                          </Typography>
                        </Card>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography>Bạn chưa có xe để đăng ký dịch vụ.</Typography>
                </Box>
              )}
            </Box>
          )}
        />
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight={500}>
          Thông tin tiếp nhận
        </Typography>
        {userInfo?.role !== "mechanic" && (
          <Controller
            name="mechanic_id"
            control={control}
            render={({ field }) => (
              <MechanicsSelect
                onChange={(mechanic) => {
                  field.onChange(mechanic);
                }}
                value={field.value || ""}
              />
            )}
          />
        )}

        {check_in_info.map((info) => (
          <Box key={info.key}>
            <Controller
              name={info.key as "type" | "mileage_at_check_in" | "description"}
              control={control}
              rules={{
                required: info.required ? `Vui lòng điền ${info.label}` : false,
                min:
                  info.min !== undefined
                    ? {
                        value: info.min,
                        message: `${info.label} phải lớn hơn hoặc bằng ${info.min}`,
                      }
                    : undefined,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required={info.required}
                  label={info.label}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  margin="normal"
                  select={info.type === "select"}
                  type={info.type || "text"}
                  inputProps={{
                    min: 0,
                  }}
                >
                  {info.type === "select" &&
                    info.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
            {info.key === "type" && existedTickets?.length > 0 && (
              <Typography color="success">
                Phiếu {serviceType === "maintenance" ? "bảo dưỡng" : "sửa chữa"}{" "}
                cho xe này (Mã phiếu: {existedTickets[0].serviceTicket_id}) đang
                chờ xử lý. Vui lòng trở về trang quản lý dịch vụ để cập nhật!
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{
            display: "block",
            bgcolor: "darkgray",
            "&:hover": { bgcolor: "gray" },
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBack
            sx={{
              width: 18,
            }}
          />{" "}
          Trở về
        </Button>
        <Button
          sx={{ width: 200 }}
          disabled={existedTickets?.length > 0}
          onClick={() => {
            handleSubmit((data) => {
              mutation.mutate(data);
            })();
          }}
          variant="contained"
          color="primary"
        >
          Thêm dịch vụ
        </Button>
      </Box>
    </Box>
  );
}
