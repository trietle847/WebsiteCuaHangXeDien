

import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './pages/Home'
import { Box, Typography } from '@mui/material'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

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
