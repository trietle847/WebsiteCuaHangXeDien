import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./pages/Home";
import { Box, Typography } from "@mui/material";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component={"main"}
        sx={{
          flexGrow: 1,
          margin: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Box>
      {location.pathname !== "/dashboard" && (
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
