import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import { BarChart } from "@mui/x-charts";
import KPICard from "./KPICard";
import { useQuery } from "@tanstack/react-query";
import reportApi from "../../../services/report.api";
import { format } from "date-fns";
import { TwoWheeler, ThumbUp, Star, Warning } from "@mui/icons-material";
import { formatCurrency } from "../../../helpper/FormatNumber";
import { useState } from "react";

interface ProductReportProps {
  selectedDate?: Date | null;
}

export default function ProductReport({ selectedDate }: ProductReportProps) {
  const [selectedType, setSelectedType] = useState("revenue");

  const currentMonthYear = format(new Date(), "yyyy-MM");
  const selectedMonthYear = selectedDate
    ? format(selectedDate, "yyyy-MM")
    : currentMonthYear;

  const isCurrentMonth = selectedMonthYear === currentMonthYear;

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", "product", selectedMonthYear],
    queryFn: () => reportApi.getProductStatistic(selectedMonthYear),
  });

  const report = data?.data;

  // ✅ Dataset cho doanh thu (sort theo totalRevenue)
  const sortedRevenueProducts = report?.products
    ? [...report.products]
        .map((product) => ({
          ...product,
          totalRevenue: Number(product.totalRevenue) || 0,
          totalSold: Number(product.totalSold) || 0,
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
    : [];

  // ✅ Dataset cho số lượng bán (report.products đã sort sẵn theo totalSold từ backend)
  const sortedSoldProducts = report?.products
    ? [...report.products].map((product) => ({
        ...product,
        totalRevenue: Number(product.totalRevenue) || 0,
        totalSold: Number(product.totalSold) || 0,
      }))
    : [];

  // ✅ Chọn dataset phù hợp và title
  const chartDataset =
    selectedType === "revenue"
      ? sortedRevenueProducts.slice(0, 5)
      : sortedSoldProducts.slice(0, 5);

  const chartTitle =
    selectedType === "revenue"
      ? "Top 5 sản phẩm có doanh thu cao nhất"
      : "Top 5 sản phẩm bán chạy nhất";

  console.log(sortedRevenueProducts);

  if (isLoading) return <CircularProgress />;

  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Thống kê sản phẩm
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
            title="Tổng sản phẩm đã bán"
            Icon={TwoWheeler}
            gradientColors={["#6366f1", "#a855f7"]}
            value={report ? `${report.totalProductSold}` : "N/A"}
          />
          <KPICard
            title="Sản phẩm bán chạy nhất"
            Icon={ThumbUp}
            gradientColors={["#090979", "#00D4FF"]}
            value={
              report
                ? `${report.products?.[0].name} (SL: ${report.products?.[0].totalSold})`
                : "N/A"
            }
          />
          <KPICard
            title="Sản phẩm có doanh thu cao nhất"
            Icon={Star}
            gradientColors={["#A1C234", "#30BA5C"]}
            value={
              report && sortedRevenueProducts?.[0] ? (
                <>
                  {sortedRevenueProducts[0].name} (DT:{" "}
                  {formatCurrency(sortedRevenueProducts[0].totalRevenue)})
                </>
              ) : (
                "N/A"
              )
            }
          />
          {report.lowestStockProduct && (
            <KPICard
              title="Sản phẩm có tồn kho thấp nhất"
              Icon={Warning}
              gradientColors={["#FF7373", "#ED2800"]}
              value={
                report
                  ? report.lowestStockProduct.name +
                    ` (Tồn: ${report.lowestStockProduct.totalStock})`
                  : "N/A"
              }
            />
          )}
        </Box>
      ) : (
        <Typography>Không có dữ liệu báo cáo sản phẩm.</Typography>
      )}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {chartTitle}
          </Typography>
          <TextField
            select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="revenue">Theo Doanh thu</MenuItem>
            <MenuItem value="sold">Theo Số lượng bán</MenuItem>
          </TextField>
        </Box>

        <BarChart
          dataset={chartDataset}
          layout="horizontal"
          yAxis={[
            {
              scaleType: "band",
              dataKey: "name",
              categoryGapRatio: 0.3,
              barGapRatio: 0.1,
            },
          ]}
          xAxis={[
            {
              label: selectedType === "revenue" ? "Doanh thu (₫)" : "Số lượng",
              valueFormatter: (value: number) =>
                selectedType === "revenue"
                  ? new Intl.NumberFormat("vi-VN").format(value)
                  : Math.round(value).toString(),
            },
          ]}
          series={[
            {
              dataKey:
                selectedType === "revenue" ? "totalRevenue" : "totalSold",
              label: selectedType === "revenue" ? "Doanh thu" : "Số lượng bán",
              color: selectedType === "revenue" ? "#10b981" : "#3b82f6",
              valueFormatter: (value) =>
                selectedType === "revenue"
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value || 0)
                  : `${Math.round(value || 0)} sản phẩm`,
            },
          ]}
          height={400}
          margin={{ left: 40, right: 40, top: 40, bottom: 60 }}
          slotProps={{
            legend: {
              position: { vertical: "top", horizontal: "center" },
            },
          }}
        />
      </Paper>
    </Box>
  );
}
