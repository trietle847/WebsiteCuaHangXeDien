import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './pages/Home'
import { Box, Typography } from '@mui/material'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component={"main"} sx={{ flexGrow: 1, p: 3, margin: "auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
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
