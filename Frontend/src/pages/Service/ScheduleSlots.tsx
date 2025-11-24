import { Box, Typography, Chip, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import serviceTicketApi from "../../services/serviceTicket.api";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  addWeeks,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { Schedule } from "@mui/icons-material";
import { useState } from "react";

type ScheduleSlot = {
  hour: number;
  booked: number;
  available: number;
  isFull: boolean;
};

const MIN_DATE = new Date().getHours() + 4 > 16 ? addDays(new Date(), 1) : new Date();

export default function ScheduleSlots({
  onChange,
  selectedDate,
}: {
  onChange: (slotDate: Date | null) => void;
  selectedDate: Date | null;
}) {

  const [localDate, setLocalDate] = useState<Date>(selectedDate || MIN_DATE);

  const formattedDate = format(localDate, "yyyy-MM-dd");

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["slots", formattedDate],
    queryFn: () => serviceTicketApi.getScheduleSlots(formattedDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const scheduleSlots: ScheduleSlot[] = data?.data || [];

  return (
      <Box sx={{ width: "100%", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}> 
          <Schedule fontSize="medium" />
          <Typography variant="h5" fontWeight={600}>
            Chọn khung giờ dịch vụ
          </Typography>
        </Box>
        <Typography sx={{ mb: 2 }} color="text.secondary">
          Vui lòng chọn ngày và khung giờ bạn muốn đặt lịch dịch vụ.
        </Typography>
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
            minDate={MIN_DATE}
            maxDate={addWeeks(MIN_DATE, 4)}
            value={localDate || MIN_DATE}
            onChange={(newValue) => {
              if (newValue) {
                setLocalDate(newValue);
                onChange(null);
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
        <Typography variant="h6" gutterBottom>
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
            {scheduleSlots.map((slot) => {
              const isSelected = selectedDate?.getHours() === slot.hour;
              return (
                <Chip
                  key={slot.hour}
                  variant={
                    isSelected ? "filled" : "outlined"
                  }
                  color={slot.isFull ? "error" : "primary"}
                  disabled={
                    slot.isFull ||
                    (
                      format(localDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") &&
                      slot.hour - new Date().getHours() < 4
                    )
                  }
                  onClick={() => {
                    let slotDate = setHours(localDate || MIN_DATE, slot.hour);
                    slotDate = setMinutes(slotDate, 0);
                    slotDate = setSeconds(slotDate, 0);
                    slotDate = setMilliseconds(slotDate, 0);
                    onChange(slotDate);
                  }}
                  label={`${slot.hour}h - ${slot.hour + 1}h\n(${
                    slot.available
                  } chỗ trống)`}
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
              );
            })}
          </Box>
        )}
      </Box>
  );
}
