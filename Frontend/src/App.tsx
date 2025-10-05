import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header-footer/Header";
import Home from "./pages/Home/Home";
import { Box, Typography } from "@mui/material";
import Login from "./pages/User/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductList from "./pages/Product/ProductList";
import ProductDetail from "./pages/Product/ProductDetail";
import Register from "./pages/User/Register";
import { useLocation } from "react-router-dom";
import DashboardContent from "./pages/Dashboard/DashboardContent";

function App() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component={"main"}
        sx={{
          flexGrow: 1,
          margin: location.pathname.startsWith("/products") ? 0 : "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="products" />} />
            <Route path=":section" element={<DashboardContent />} />
          </Route>
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
      {!location.pathname.includes("/dashboard") && (
        <Box sx={{ bgcolor: "gray", color: "white", p: 6 }} component="footer">
          <Typography variant="body2" align="center">
            {"Copyright © "}
            All rights reserved {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default App;
