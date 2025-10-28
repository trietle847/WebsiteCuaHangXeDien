import React from "react";
import { Box, Typography, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatIcon from "@mui/icons-material/Chat";
import { Phone } from "@mui/icons-material";

export default function FloatingContact() {
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.includes("/dashboard")
  ) {
    return null;
  }

  const contacts = [
    {
      name: "Zalo",
      color: "#000",
      href: "https://zalo.me/0939133847",
      icon: <ChatIcon sx={{ color: "#1E90FF" }} />,
    },
    {
      name: "Messenger",
      color: "#000",
      href: "https://m.me/minhtriet.le.3367",
      icon: <FacebookIcon sx={{ color: "#1E90FF" }} />,
    },
    {
      name: "Phone",
      color: "#000",
      href: "tel:0939133847",
      icon: <Phone sx={{ color: "#1E90FF" }} />,
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        zIndex: 2000,
        gap: 0.3,
      }}
    >
      {contacts.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          target="_blank"
          underline="none"
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            // borderRadius: "24px 0 0 24px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            height: 46,
            transform: "translateX(100px)",
            transition: "all 0.35s ease",
            cursor: "pointer",
            overflow: "hidden",
            "&:hover": {
              transform: "translateX(0)", 
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              flexShrink: 0,
            }}
          >
            {item.icon}
          </Box>
          <Typography
            sx={{
              color: item.color,
              fontWeight: 500,
              px: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {item.name}
          </Typography>
        </Link>
      ))}
    </Box>
  );
}
