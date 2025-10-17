import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  if (location.pathname.includes("/dashboard")) {
    return null;
  }
  return (
      <Box sx={{ bgcolor: "gray", color: "white", p: 6 }} component="footer">
        <Typography variant="body2" align="center">
          {"Copyright © "}
          All rights reserved {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
  );
}