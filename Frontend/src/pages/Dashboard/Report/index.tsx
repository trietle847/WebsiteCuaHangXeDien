import { Box, Tabs, Tab } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import GeneralReport from "./General";
import ProductReport from "./ProductReport";
import UserReport from "./UserReport";
import { useState } from "react";

export default function Report() {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const currentMonthYear = format(new Date(), "yyyy-MM");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Tabs
          sx={{
            mb: 2,
          }}
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
        >
          <Tab value={0} label="Tổng quan" />
          <Tab value={1} label="Sản phẩm" />
          <Tab value={2} label="Người dùng" />
        </Tabs>
        <DatePicker
          sx={{
            mb: 2,
          }}
          views={["month", "year"]}
          label="Chọn tháng"
          value={selectedDate || new Date()}
          onChange={(newValue) => {
            if (newValue && format(newValue, "yyyy-MM") === currentMonthYear) {
              setSelectedDate(null);
            } else {
              setSelectedDate(newValue);
            }
          }}
        />
      </Box>

      <Box>
        {tabIndex === 0 && <GeneralReport selectedDate={selectedDate} />}
        {tabIndex === 1 && <ProductReport selectedDate={selectedDate} />}
        {tabIndex === 2 && <UserReport />}
      </Box>
    </Box>
  );
}
