import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery } from "@tanstack/react-query";
import reportApi from "../../../services/report.api";
import { useState } from "react";

// Format ngắn gọn cho trục Y
const formatYAxis = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} Tỷ`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)} Tr`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toString();
};

type AnnualRevenueData = {
  name: string; // Tháng
  revenue: number; // Doanh thu
};

export default function GeneralChart() {
  const [selectedYear, setSelectedYear] = useState<number | null>(
    new Date().getFullYear()
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", "annual", selectedYear],
    queryFn: () => reportApi.getAnnualRevenue(selectedYear),
    staleTime: 10 * 60 * 1000, // 10 phút
  });

  const chartData = data?.data as AnnualRevenueData[];

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
        <Typography>Lỗi: {error.message}</Typography>
      </Box>
    );

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Biểu đồ tăng trưởng doanh thu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Doanh thu theo tháng của năm {selectedYear}
          </Typography>
        </Box>

        <DatePicker
          views={["year"]}
          label="Chọn năm"
          value={selectedYear ? new Date(selectedYear, 0, 1) : null}
          onChange={(newValue) => {
            setSelectedYear(newValue ? newValue.getFullYear() : null);
          }}
          slotProps={{
            textField: {
              size: "medium",
            },
          }}
        />
      </Box>

      {/* Chart */}
      {chartData && chartData.length > 0 ? (
        <Box sx={{ width: "100%", height: 400 }}>
          <LineChart
            xAxis={[
              {
                data: chartData.map((item) => item.name),
                scaleType: "point",
                label: "Tháng",
              },
            ]}
            series={[
              {
                data: chartData.map((item) => item.revenue),
                label: "Doanh thu",
                color: "#10b981",
                area: true,
                showMark: true,
                curve: "monotoneX",
              },
            ]}
            height={400}
            margin={{ top: 20, right: 20, bottom: 50 }}
            grid={{ vertical: true, horizontal: true }}
            slotProps={{
              legend: {
                direction: "horizontal",
                position: { vertical: "top", horizontal: "end" },
              },
            }}
            yAxis={[
              {
                label: "Doanh thu (VNĐ)",
                valueFormatter: (value: number) => formatYAxis(value),
              },
            ]}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Không có dữ liệu cho năm {selectedYear}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
