import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import reportApi from "../../../services/report.api";
import {
  ShoppingBag,
  Paid,
  PriceChange,
  Person,
  TwoWheeler,
} from "@mui/icons-material";
import { format } from "date-fns";
import KPICard from "./KPICard";

interface GeneralKPIProps {
  selectedDate: Date | null;
}

export default function GeneralKPI({selectedDate}: GeneralKPIProps) {

  // Check nếu đang xem tháng hiện tại
  const currentMonthYear = format(new Date(), "yyyy-MM");
  const selectedMonthYear = selectedDate
    ? format(selectedDate, "yyyy-MM")
    : currentMonthYear;

  const isCurrentMonth = selectedMonthYear === currentMonthYear;

  // Query key và API call khác nhau tùy theo mode
  const { data, isLoading, error } = useQuery({
    queryKey: isCurrentMonth
      ? ["reports", "current-month"] // Current month - key đơn giản, luôn fetch mới
      : ["reports", "monthly", selectedMonthYear], // Past month - cache theo tháng
    queryFn: () => {
      // Backend sẽ handle: "current" = có comparison, "yyyy-MM" = không comparison
      return reportApi.getMonthStatistic(
        isCurrentMonth ? null : selectedMonthYear
      );
    },
    staleTime: isCurrentMonth ? 1 * 60 * 1000 : 10 * 60 * 1000,
    // Current: 1 phút (refresh thường xuyên)
    // Past: 10 phút (cache lâu hơn vì data không đổi)
  });

  const report = data?.data;

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Báo cáo tổng quan
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Chỉ số chính tháng{" "}
              {selectedDate
                ? `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
                : `${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
              {isCurrentMonth && " (Tháng hiện tại)"}
            </Typography>
          </Box>
        </Box>
        {report ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
                xl: "repeat(5, 1fr)",
              },
              gap: 3,
            }}
          >
            <KPICard
              title="Tổng đơn hàng"
              value={report.totalOrders}
              Icon={ShoppingBag}
              gradientColors={["#ec4899", "#f43f5e"]}
              change={report.change?.totalOrders}
            />
            <KPICard
              title="Tổng doanh thu"
              value={report.totalRevenue}
              format="currency"
              Icon={Paid}
              gradientColors={["#10b981", "#14b8a6"]}
              change={report.change?.totalRevenue}
            />
            <KPICard
              title="Giá trị đơn hàng trung bình"
              value={report.aov}
              format="currency"
              Icon={PriceChange}
              gradientColors={["#ef4444", "#f97316"]}
              change={report.change?.aov}
            />

            <KPICard
              title="Tổng khách hàng mới"
              value={report.totalUsers}
              Icon={Person}
              gradientColors={["#3b82f6", "#8b5cf6"]}
              change={report.change?.totalUsers}
            />

            <KPICard
              title="Tổng sản phẩm bán ra"
              value={report.totalProductsSold}
              Icon={TwoWheeler}
              gradientColors={["#6366f1", "#a855f7"]}
              change={report.change?.totalProductsSold}
            />
          </Box>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Box>
    </Box>
  );
}
