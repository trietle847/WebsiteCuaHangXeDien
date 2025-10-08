import { Box, Typography } from "@mui/material";
import DataTable from "./DataTable";
import { productTable } from "./displayConfig";
import { useParams, Navigate } from "react-router-dom";
import UploadFile from "../../components/inputs/UploadFile";

// Config cho các section
const dashboardRoutes: Record<string, React.ReactNode> = {
  products: <DataTable displayConfig={productTable} />,
  orders: <Typography>Đơn hàng - Đang phát triển</Typography>,
  customers: <Typography>Khách hàng - Đang phát triển</Typography>,
  reports: <Typography>Báo cáo - Đang phát triển</Typography>,
  test: <UploadFile compact columns={3} previewHeight={150} />,
};

export default function DashboardContent() {
  const { section } = useParams<{ section: string }>();

  // Nếu section không tồn tại, redirect về products
  if (!section || !dashboardRoutes[section]) {
    return <Navigate to="/dashboard/products" replace />;
  }

  return <Box width="100%">{dashboardRoutes[section]}</Box>;
}
