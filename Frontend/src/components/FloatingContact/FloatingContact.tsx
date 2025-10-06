// src/components/FloatingContact.tsx
import { Box, Typography, Link, Stack } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatIcon from "@mui/icons-material/Chat";

export default function FloatingContact() {
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.includes("/dashboard")
  ) {
    return null;
  }
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 100,
        right: 20,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* Hotline */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          bgcolor: "white",
          p: 1.2,
          borderRadius: 3,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          minWidth: 200,
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
        }}
      >
        <PhoneIcon color="primary" />
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1976d2" }}
          >
            Hotline
          </Typography>
          <Link href="tel:0939133847" underline="none" color="text.primary">
            <p style={{fontSize: 14}}>0939133847</p>
          </Link>
        </Box>
      </Stack>

      {/* Zalo */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          bgcolor: "white",
          p: 1,
          borderRadius: 3,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          minWidth: 100,
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
        }}
        component={Link}
        href="https://zalo.me/0939133847"
        target="_blank"
        underline="none"
      >
        <ChatIcon sx={{ color: "#1E90FF" }} />
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1E90FF" }}
          >
            Zalo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (8h–22h30)
          </Typography>
        </Box>
      </Stack>

      {/* Facebook */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          bgcolor: "white",
          p: 1.2,
          borderRadius: 3,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          minWidth: 200,
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
        }}
        component={Link}
        href="https://m.me/minhtriet.le.3367"
        target="_blank"
        underline="none"
      >
        <FacebookIcon sx={{ color: "#1877F2" }} />
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1877F2" }}
          >
            Facebook
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (8h–22h30)
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
