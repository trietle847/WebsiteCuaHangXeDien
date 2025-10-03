import { Routes, Route } from "react-router-dom";
import Header from "./components/header-footer/Header";
import Home from "./pages/Home/Home";
import { Box, Typography } from "@mui/material";
import Login from "./pages/User/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/Product/ProductList";
import ProductDetail from "./pages/Product/ProductDetail";
import Register from "./pages/User/Register";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component={"main"}
        sx={{
          flexGrow: 1,
          p: 3,
          margin: location.pathname === "/products" ? 0 : "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
      <Box sx={{ bgcolor: "gray", color: "white", p: 6 }} component="footer">
        <Typography variant="body2" align="center">
          {"Copyright © "}
          All rights reserved {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
