import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRoleRouteProps {
  allowedRoles: [
    "user" | "staff" | "admin" | "store_keeper" | "sale_staff" | "mechanic"
  ];
}

const isStaffRole = (role: string) => {
  return ["admin", "store_keeper", "sale_staff", "mechanic"].includes(role);
};

export default function ProtectedRoleRoute({
  allowedRoles,
}: ProtectedRoleRouteProps) {
  const { userInfo, loading } = useAuth();

  // Đang check auth → show loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Chưa đăng nhập → redirect login
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra quyền truy cập
  const hasAccess =
    allowedRoles.includes(userInfo.role as any) ||
    (allowedRoles.includes("staff") && isStaffRole(userInfo.role));

  // KHÔNG có quyền → redirect home
  if (!hasAccess) {
    return <Navigate to="/" />;
  }

  // Có quyền → cho vào
  return <Outlet />;
}
