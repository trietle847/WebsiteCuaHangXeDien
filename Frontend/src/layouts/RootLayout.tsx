import Header from "./Header";
import FloatingContact from "./FloatingContact";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
        <FloatingContact />
      </Box>
      <Footer />
    </Box>
  );
}

export default RootLayout;
