import { Box, Typography, Chip, Card, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import serviceTicketApi from "../../services/serviceTicket.api";
import { useQuery } from "@tanstack/react-query";
import { format, addWeeks } from "date-fns";
import { useState } from "react";

type ScheduleSlot = {
  hour: number;
  booked: number;
  available: number;
  isFull: boolean;
};

export default function ScheduleSlots() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);

  const handleSlotClick = (slot: ScheduleSlot) => {
    setSelectedSlot(slot);
  };

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["slots", formattedDate],
    queryFn: () => serviceTicketApi.getScheduleSlots(formattedDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const scheduleSlots: ScheduleSlot[] = data?.data || [];

  return (
    <Box
      sx={{
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chọn ngày đặt lịch:
        </Typography>
        <DatePicker
          minDate={new Date()}
          maxDate={addWeeks(new Date(), 4)}
          value={selectedDate}
          onChange={(newValue) => {
            if (newValue) {
              setSelectedDate(newValue);
              setSelectedSlot(null);
            }
          }}
        />
      </Box>
      {isLoading && !isFetching && <CircularProgress size={24} />}
      {isFetching && <CircularProgress size={24} />}
      {error && (
        <Typography color="error">
          Đã có lỗi xảy ra khi tải khung giờ. Vui lòng thử lại.
        </Typography>
      )}
      <Typography variant="h6" gutterBottom >
        Chọn khung giờ:
      </Typography>
      {scheduleSlots.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(auto-fill, minmax(140px, 1fr))",
              md: "repeat(auto-fill, minmax(170px, 1fr))",
            },
            gap: 2,
            mt: 2,
          }}
        >
          {scheduleSlots.map((slot) => (
            <Chip
              key={slot.hour}
              variant={selectedSlot?.hour === slot.hour ? "filled" : "outlined"}
              color={slot.isFull ? "error" : "primary"}
              disabled={
                slot.isFull ||
                (slot.hour - new Date().getHours() < 4 &&
                  format(selectedDate, "yyyy-MM-dd") ===
                    format(new Date(), "yyyy-MM-dd"))
              }
              onClick={() => handleSlotClick(slot)}
              label={`${slot.hour}h - ${slot.hour + 1}h\n(${slot.available} chỗ trống)`}
              sx={{
                height: "48px", // Chiều cao cố định cho đẹp
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "8px", // Bo góc vuông hơn 1 chút nhìn hiện đại hơn pill shape mặc định
                width: "100%", // Bắt buộc: Chip giãn hết ô grid
                "& .MuiChip-label": {
                  width: "100%",
                  textAlign: "center",
                  padding: 0,
                },
              }}
            />
          ))}
        </Box>
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Khung giờ đã chọn:
        </Typography>
        {selectedSlot ? (
          <Card
            sx={{
              maxWidth: 300,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1">
                Ngày: {format(selectedDate, "dd/MM/yyyy")}, {selectedSlot.hour}h
                - {selectedSlot.hour + 1}h
              </Typography>
              <Typography variant="subtitle1">
                Số chỗ đã đặt: {selectedSlot.booked}
              </Typography>
              <Typography variant="subtitle1">
                Số chỗ trống: {selectedSlot.available}
              </Typography>
            </Box>
          </Card>
        ) : (
          <Typography variant="subtitle1">
            Chọn khung giờ để xem chi tiết
          </Typography>
        )}
      </Box>
    </Box>
  );
}
