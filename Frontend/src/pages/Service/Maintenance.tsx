import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Typography,
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

export default function Maintenance() {
  const { data: ticketData } = useQuery({
    queryKey: ["customerServiceTickets"],
    queryFn: () => serviceTicketApi.getServiceTicketByCustomer(),
  });

  const { userInfo } = useAuth();

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
      ticket.type === "maintenance" &&
      (ticket.status === "confirmed" || ticket.status === "inProgress") &&
      ticket.vehicle_id === selectedVehicle?.vehicle_id
  );

  const hasFreeMaintenance = maintenanceTickets.length > 0;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const formattedDate = format(selectedSlot!, "yyyy-MM-dd HH:00:ss");
      if (hasFreeMaintenance) {
        return serviceTicketApi.update(maintenanceTickets[0].serviceTicket_id, {
          status: "confirmed",
          confirmed_date_time: formattedDate,
        });
      } else {
        return serviceTicketApi.create({
          vehicle_id: selectedVehicle?.vehicle_id,
          type: "maintenance",
          status: "confirmed",
          confirmed_date_time: formattedDate,
        });
      }
    },
    onSuccess: () => {
      toast.success("Đăng ký bảo dưỡng thành công!");
      queryClient.invalidateQueries({ queryKey: ["customerServiceTickets"] });
    },
    onError: (error: Error) => {
      toast.error(`${error.message || "Đăng ký bảo dưỡng không thành công!"}`);
    }
  });

  const ticketInfo = [
    {
      label: "Khách hàng",
      value: `${userInfo?.last_name} ${userInfo?.first_name}` || "",
    },
    {
      label: "Số điện thoại",
      value: userInfo?.phone || "",
    },
    {
      label: "Xe bảo dưỡng (Số khung)",
      value: selectedVehicle?.vin || "",
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

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        textAlign={"center"}
        fontWeight={600}
      >
        Đăng ký bảo dưỡng xe điện
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          mt: 2,
          gap: 4,
          px: 2,
        }}
      >
        <Box>
          <ChooseVehicle onChange={setSelectedVehicle} />
          <Typography variant="h5" gutterBottom>
            Xe đã chọn:
          </Typography>
          <Card sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <span>
                {selectedVehicle
                  ? `${selectedVehicle.ProductColor.Product.name} (${selectedVehicle.ProductColor.Color.name})`
                  : "Chưa chọn xe"}
              </span>
              {selectedVehicle && (
                <span>Số khung: {selectedVehicle?.vin || "Chưa có"}</span>
              )}
              {selectedVehicle && (
                <span>
                  Số máy: {selectedVehicle?.engine_number || "Chưa có"}
                </span>
              )}
            </Typography>
            {maintenanceTickets.length > 0 && (
              <Box>
                <Typography variant="h6">
                  Xe này có 1 phiếu bảo dưỡng định kỳ miễn phí
                  <Typography
                    sx={{
                      color: "red",
                    }}
                    variant="h6"
                    component={"span"}
                  >
                    {" "}
                    (Dự kiến hạn cuối:{" "}
                    {maintenanceTickets[0].expected_date
                      ? format(
                          new Date(maintenanceTickets[0].expected_date),
                          "dd/MM/yyyy"
                        )
                      : "Không xác định"}
                    )
                  </Typography>
                </Typography>
                {!selectedSlot && (
                  <Typography variant="subtitle2">
                    Hãy chọn khung giờ hẹn để hưởng ưu đãi từ chính sách bảo
                    dưỡng!
                  </Typography>
                )}
              </Box>
            )}
            {alreadyBooked && (
              <Typography
                variant="h6"
                color="error"
              >
                Xe này đã có phiếu bảo dưỡng đang chờ xử lý hoặc đã được xác nhận!
              </Typography>
            )}
          </Card>
        </Box>
        <ScheduleSlots
          onChange={(slotDate) => {
            setSelectedSlot(slotDate);
          }}
        />
      </Box>
      <Divider
        sx={{
          py: 2,
          color: "black",
        }}
      />
      <Box
        sx={{
          maxWidth: 600,
          textAlign: "center",
          mx: "auto",
        }}
      >
        <ToastContainer />
        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Thông tin phiếu bảo dưỡng:
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            p: 2,
            width: "100%",
          }}
        >
          {ticketInfo.map((info) => (
            <TextField
              key={info.label}
              label={info.label}
              value={info.value}
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
          <Button
            disabled={!selectedVehicle || !selectedSlot || alreadyBooked}
            variant="contained"
            onClick={() => mutation.mutate()}
          >
            Đăng ký
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
