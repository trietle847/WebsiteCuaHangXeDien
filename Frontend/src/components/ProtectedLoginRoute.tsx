import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ProtectedLoginRoute() {
  const { userInfo, loading } = useAuth();
  const location = useLocation();

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

  if (userInfo) {
    const from =
      userInfo.role === "user" ? location.state?.from || "/" : "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Có quyền → cho vào
  return <Outlet />;
}
