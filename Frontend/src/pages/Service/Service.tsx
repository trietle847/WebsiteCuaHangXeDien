import {
  Box,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
} from "@mui/material";
import ScheduleSlots from "./ScheduleSlots";
import ChooseVehicle from "./ChooseVehicle";
import serviceTicketApi from "../../services/serviceTicket.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServiceTicket, Vehicle } from "../../lib/types";
import { format, addHours } from "date-fns";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Verified, Warning } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";

export default function Service() {
  const { data: ticketData } = useQuery({
    queryKey: ["customerServiceTickets"],
    queryFn: () => serviceTicketApi.getServiceTicketByCustomer(),
  });

  const { control, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      type: "",
      description: "",
    },
  });

  const serviceType = watch("type");

  const { userInfo } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const tickets: ServiceTicket[] = ticketData?.data || [];

  const maintenanceTickets = tickets.filter(
    (ticket) =>
      ticket.type === "maintenance" &&
      ticket.status === "pending" &&
      ticket.vehicle_id === selectedVehicle?.vehicle_id
  );

  const alreadyBooked = tickets.some(
    (ticket) =>
      (ticket.status === "confirmed" || ticket.status === "inProgress") &&
      ticket.vehicle_id === selectedVehicle?.vehicle_id
  );

  const hasFreeMaintenance = maintenanceTickets.length > 0;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { type: string; description: string }) => {
      const formattedDate = format(selectedSlot!, "yyyy-MM-dd HH:00:ss");
      if (hasFreeMaintenance && serviceType === "maintenance") {
        return serviceTicketApi.update(maintenanceTickets[0].serviceTicket_id, {
          status: "confirmed",
          confirmed_date_time: formattedDate,
          description: data.description,
        });
      } else {
        return serviceTicketApi.create({
          ...data,
          vehicle_id: selectedVehicle?.vehicle_id,
          status: "confirmed",
          confirmed_date_time: formattedDate,
        });
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["customerServiceTickets"] });
      reset();
      setActiveStep(0);
      setSelectedSlot(null);
      setSelectedVehicle(null);
      toast.success(
        res.message ||
          `Đăng ký ${
            serviceType === "repair" ? "sửa chữa" : "bảo dưỡng"
          } thành công!`
      );
    },
    onError: (error: Error) => {
      toast.error(
        `${
          error.message ||
          `Đăng ký ${
            serviceType === "repair" ? "sửa chữa" : "bảo dưỡng"
          } không thành công!`
        }`
      );
    },
  });

  const ticketInfo = [
    {
      label: "Khách hàng",
      value:
        userInfo?.last_name && userInfo?.first_name
          ? `${userInfo.last_name} ${userInfo.first_name}`
          : "",
    },
    {
      label: "Số điện thoại",
      value: userInfo?.phone || "",
    },
    {
      label: "Xe bảo dưỡng (Số khung)",
      value: selectedVehicle
        ? `${selectedVehicle.ProductColor?.Product.name} ${selectedVehicle.ProductColor?.Color.name} - ${selectedVehicle.vin}`
        : "",
      placeholder: "Vui lòng chọn xe",
    },
    {
      label: "Khung giờ hẹn",
      value: selectedSlot
        ? `${format(new Date(selectedSlot), "dd/MM/yyyy HH:00")} - ${format(
            addHours(new Date(selectedSlot), 1),
            "HH:00"
          )}`
        : "",
      placeholder: "Vui lòng chọn khung giờ hẹn",
    },
  ];

  const steps = [
    {
      label: "Chọn xe điện",
      content: (
        <ChooseVehicle
          onChange={setSelectedVehicle}
          selectedVehicleId={selectedVehicle?.vehicle_id || ""}
        />
      ),
    },
    {
      label: "Chọn khung giờ hẹn",
      content: (
        <ScheduleSlots
          selectedDate={selectedSlot}
          onChange={(slotDate) => {
            setSelectedSlot(slotDate);
          }}
        />
      ),
    },
    {
      label: "Xác nhận thông tin",
      content: (
        <Box
          sx={{
            mx: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <Verified sx={{ mr: 1, verticalAlign: "middle" }} />
            Xác nhận thông tin
          </Typography>
          <Typography sx={{ mb: 2 }} color="text.secondary">
            Vui lòng kiểm tra kỹ thông tin trước khi đặt lịch.
          </Typography>
          <Box
            sx={{
              width: "100%",
            }}
          >
            {ticketInfo.map((info) => (
              <TextField
                key={info.label}
                label={info.label}
                value={info.value || ""}
                fullWidth
                margin="normal"
                placeholder={info.placeholder || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            ))}
            <Controller
              name="type"
              control={control}
              rules={{
                required: "Cần chọn dịch vụ để hoàn tất đăng ký",
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  name="service_type"
                  label="Loại dịch vụ"
                  fullWidth
                  margin="normal"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  select
                >
                  <MenuItem value="maintenance">Bảo dưỡng định kỳ</MenuItem>
                  <MenuItem value="repair">Sửa chữa</MenuItem>
                </TextField>
              )}
            />
            {serviceType === "maintenance" && hasFreeMaintenance && (
              <Typography color="success" sx={{ mt: 1 }} textAlign={"justify"}>
                Xe của bạn vẫn còn trong hạn chính sách bảo dưỡng. Trong lịch
                hẹn lần này bạn sẽ được sử dụng bảo dưỡng miễn phí !
              </Typography>
            )}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  name="service_description"
                  label={
                    serviceType === "repair"
                      ? "Mô tả vấn đề bạn gặp phải"
                      : "Ghi chú"
                  }
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
              )}
            />
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <ToastContainer />
      <Typography variant="h4" textAlign={"center"} fontWeight={600}>
        Đăng ký đặt lịch dịch vụ xe máy điện
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        textAlign={"center"}
        color="text.secondary"
        sx={{ maxWidth: 600 }}
      >
        Đăng ký đặt lịch chỉ với 3 bước
      </Typography>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ width: "100%", maxWidth: 800 }}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
          px: 4,
          width: "100%",
          maxWidth: 800,
        }}
      >
        {steps[activeStep].content}{" "}
        {activeStep === 0 && alreadyBooked && (
          <Typography color="error" sx={{ mt: 2 }}>
            <Warning /> Xe bạn chọn đã được xác nhận đặt lịch.
          </Typography>
        )}
        <Box>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Quay lại
          </Button>
          <Button
            disabled={
              (activeStep === 0 && !selectedVehicle) ||
              (activeStep === 0 && alreadyBooked) ||
              (activeStep === 1 && !selectedSlot)
            }
            variant="contained"
            onClick={() => {
              if (activeStep === steps.length - 1) {
                handleSubmit((data) => {
                  mutation.mutate(data);
                })();
              } else {
                handleNext();
              }
            }}
          >
            {activeStep === steps.length - 1 ? "Hoàn tất" : "Tiếp theo"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
