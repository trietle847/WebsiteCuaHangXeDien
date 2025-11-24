import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import KPICard from "./KPICard";
import ReportTable from "./ReportTable";
import { useQuery } from "@tanstack/react-query";
import reportApi from "../../../services/report.api";
import { format } from "date-fns";
import { Groups, Person, ShoppingBasket, Diamond } from "@mui/icons-material";
import { formatCurrency } from "../../../helpper/FormatNumber";
import { NumericFormat } from "react-number-format";

interface UserReportProps {
  selectedDate?: Date | null;
}

export default function UserReport({ selectedDate }: UserReportProps) {
  const currentMonthYear = format(new Date(), "yyyy-MM");
  const selectedMonthYear = selectedDate
    ? format(selectedDate, "yyyy-MM")
    : currentMonthYear;

  const isCurrentMonth = selectedMonthYear === currentMonthYear;

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", "user", selectedMonthYear],
    queryFn: () => reportApi.getUserStatistic(selectedMonthYear),
  });

  const report = data?.data;

  const chartData = report?.newUserChart || [];

  if (isLoading) return <CircularProgress />;

  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Thống kê khách hàng
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mb: 2 }}
        gutterBottom
      >
        Chỉ số chính tháng{" "}
        {selectedDate
          ? `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
          : `${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
        {isCurrentMonth && " (Tháng hiện tại)"}
      </Typography>
      {report ? (
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            <KPICard
              title="Tổng khách hàng toàn hệ thống"
              Icon={Groups}
              gradientColors={["#26E0CE", "#0085C7"]}
              value={report ? `${report.totalUsers}` : "N/A"}
            />
            <KPICard
              title="Tổng khách hàng mới trong tháng"
              Icon={Person}
              gradientColors={["#3b82f6", "#8b5cf6"]}
              value={report ? `${report.totalUsersInMonth}` : "N/A"}
            />
            <KPICard
              title="Khách hàng sử dụng lại dịch vụ trong tháng"
              Icon={ShoppingBasket}
              gradientColors={["#E0C84F", "#FFB300"]}
              value={report ? `${report.returnedUsersCount}` : "N/A"}
            />
            <KPICard
              title="Khách hàng VIP (Chi tiêu cao nhất)"
              Icon={Diamond}
              gradientColors={["#97BCDB", "#5E8CB5"]}
              value={
                report?.vipUser
                  ? `${report.vipUser.name} (${formatCurrency(
                      report.vipUser.totalSpent
                    )})`
                  : "Không có dữ liệu"
              }
            />
          </Box>
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
              Biểu đồ khách hàng mới trong tháng{" "}
              {format(new Date(selectedMonthYear), "MM/yyyy")}
            </Typography>
            <LineChart
              xAxis={[
                {
                  data: chartData.map((item: any) => item.day),
                  scaleType: "point",
                  label: "Ngày",
                  valueFormatter: (value: any) => `Ngày ${value}`,
                },
              ]}
              series={[
                {
                  data: chartData.map((item: any) => item.count),
                  label: "Khách hàng mới",
                  color: "#10b981",
                  area: false,
                  showMark: true,
                  curve: "linear",
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
                  label: "Số lượng khách hàng",
                },
              ]}
            />
          </Paper>
        </Box>
      ) : (
        <Typography>Không có dữ liệu báo cáo khách hàng.</Typography>
      )}
      <ReportTable
        queryKey="userReportTable"
        queryFn={({ keyword, page, limit }) =>
          reportApi.getUserReportTable({
            keyword,
            page,
            limit,
          })
        }
        monthYear={selectedMonthYear}
        columns={[
          { field: "name", headerName: "Tên khách hàng", width: 250 },
          {
            field: "phone",
            headerName: "Số điện thoại",
            width: 150,
          },
          {
            field: "email",
            headerName: "Email",
            width: 200,
            type: "number",
          },
          {
            field: "totalOrders",
            headerName: "Tổng đơn hàng",
            width: 150,
            type: "number",
          },
          {
            field: "totalSpent",
            headerName: "Tổng chi tiêu",
            width: 200,
            type: "number",
            valueGetter: (value) => Number(value) || "",
            renderCell: (params) => (
              <NumericFormat
                value={params.value}
                displayType={"text"}
                thousandSeparator="."
                decimalSeparator=","
                suffix=" đ"
              />
            ),
          },
          {
            field: "lastOrder",
            headerName: "Đơn hàng gần nhất",
            width: 200,
            renderCell: (params) => {
              return params.value ? format(new Date(params.value), "dd/MM/yyyy HH:mm:ss") : "Không có dữ liệu mua hàng";
            },
          },
        ]}
        idKey="user_id"
        title="khách hàng toàn hệ thống"
      />
    </Box>
  );
}
