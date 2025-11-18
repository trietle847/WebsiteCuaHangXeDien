import { Box, Typography } from "@mui/material";
import ScheduleSlots from "./ScheduleSlots";
import ChooseVehicle from "./ChooseVehicle";
import serviceTicketApi from "../../services/serviceTicket.api";
import { useQuery } from "@tanstack/react-query";
import type { ServiceTicket } from "../../lib/types";
import { format } from "date-fns/format";

export default function Maintenance() {
  const { data: ticketData } = useQuery({
    queryKey: ["customerServiceTickets"],
    queryFn: () => serviceTicketApi.getServiceTicketByCustomer(),
  });

  const tickets: ServiceTicket[] = ticketData?.data || [];

  const maintenanceTickets = tickets.filter(
    (ticket) => ticket.type === "maintenance" && ticket.status === "pending"
  );

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Đăng ký bảo dưỡng xe điện
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        <ScheduleSlots />
        <Box>
            <ChooseVehicle />
          {maintenanceTickets.length > 0 && (
            <Box>
              <Typography variant="h6">
                Bạn đang có 1 phiếu bảo dưỡng định kỳ miễn phí
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
              <Typography variant="body1">
                Vui lòng xác nhận ngày giờ bảo dưỡng để sử dụng phiếu miễn phí
                này.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
