import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export default function ProtectedLoginRoute() {
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

  if (userInfo) {
    return <Navigate to="/" />;
  }

  // Có quyền → cho vào
  return <Outlet />;
}
