import { Tooltip, Box, Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import reportApi from "../../../services/report.api";
import { ArrowUpward } from "@mui/icons-material";
import { ShoppingBag, Paid } from "@mui/icons-material";
import { NumericFormat } from "react-number-format";
import type { SvgIconProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface KPICardProps {
  title: string;
  Icon?: React.ElementType<SvgIconProps>;
  iconColor?: string; // Thêm prop cho màu icon
  format?: "number" | "currency";
  value: number | string;
  change?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

function KPICard({
  title,
  Icon,
  iconColor = "primary.main", // Default color
  value,
  change,
  format = "number",
}: KPICardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      {Icon && (
        <Box sx={{ p: 2 }}>
          <Icon sx={{ fontSize: 48, color: iconColor }} />
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          {format === "currency" ? (
            <Tooltip
              title={
                <NumericFormat
                  value={Number(value)}
                  displayType={"text"}
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                />
              }
            >
              <Typography variant="h5">
                {formatCurrency(Number(value))}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="h5">{value}</Typography>
          )}
          {change && (
            <Box
              sx={{
                ml: 2,
                display: "flex",
                alignItems: "center",
                color: change > 0 ? "success.main" : "error.main",
              }}
            >
              <Tooltip
                title={`${change > 0 ? "Tăng" : "Giảm"} ${Math.abs(
                  change
                )}% so với tháng trước`}
              >
                <ArrowUpward
                  fontSize="small"
                  sx={{ transform: change < 0 ? "rotate(180deg)" : "none" }}
                />
              </Tooltip>
              <Typography variant="body2">{Math.abs(change)}%</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function KPICards() {
  const monthYear = new Date().toISOString().slice(0, 7);
  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", monthYear],
    queryFn: () => reportApi.getMonthStatistic(monthYear),
  });

  const report = data?.data;
  console.log(report);

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <Box>
      {report ? (
        <Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Chỉ số chính tháng {new Date().getMonth() + 1}/
              {new Date().getFullYear()}
            </Typography>
            <DatePicker
              views={["year", "month"]}
              label="Chọn tháng"
              onChange={(newValue) => {
                console.log(newValue);
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
              justifyItems: "center",
            }}
          >
            <KPICard
              title="Tổng đơn hàng"
              value={report.totalOrders}
              Icon={ShoppingBag}
              iconColor="orange"
            />
            <KPICard
              title="Tổng doanh thu"
              value={report.totalRevenue}
              format="currency"
              Icon={Paid}
              iconColor="green"
            />
          </Box>
        </Box>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </Box>
  );
}
