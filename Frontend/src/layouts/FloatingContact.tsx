import React, { useState } from "react";
import { Box, Link, Fab, Tooltip, Zoom, keyframes } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { useLocation } from "react-router-dom";
import Chatbot from "../components/Chatbot/Chatbot";

//hiệu ứng Rung lắc + Tỏa sóng
const shakeAnimation = keyframes`
  0% { transform: rotate(0) scale(1) skew(1deg); }
  10% { transform: rotate(-25deg) scale(1) skew(1deg); }
  20% { transform: rotate(25deg) scale(1) skew(1deg); }
  30% { transform: rotate(-25deg) scale(1) skew(1deg); }
  40% { transform: rotate(25deg) scale(1) skew(1deg); }
  50% { transform: rotate(0) scale(1) skew(1deg); }
  100% { transform: rotate(0) scale(1) skew(1deg); }
`;

const rippleAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

export default function FloatingContact() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false); // 👈 thêm BOT

  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.includes("/dashboard")
  ) {
    return null;
  }

  const contacts = [
    {
      name: "Chat Zalo",
      color: "#0068FF", // Màu chuẩn Zalo
      href: "https://zalo.me/0939133847",
      icon: <ChatIcon />,
    },
    {
      name: "Messenger",
      color: "#0084FF", // Màu chuẩn Messenger
      href: "https://m.me/minhtriet.le.3367",
      icon: <FacebookIcon />,
    },
    {
      name: "Gọi ngay",
      color: "#4CAF50", // Màu xanh gọi điện
      href: "tel:0939133847",
      icon: <PhoneIcon />,
    },
  ];

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 30,
        right: 30,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column-reverse", // Đảo ngược để nút chính ở dưới cùng
        alignItems: "center",
        gap: 2,
      }}
    >
      {chatbotOpen && (
        <Tooltip title="Chat với trợ lý ảo" placement="left" arrow>
          <div
            style={{ position: "fixed", bottom: 330, right: 85, zIndex: 1500 }}
          >
            <Chatbot />
          </div>
        </Tooltip>
      )}

      {/* --- NÚT CHÍNH (TRIGGER) --- */}
      <Box sx={{ position: "relative" }}>
        <Fab
          color="primary"
          aria-label="contact"
          onClick={() => {
            toggleOpen();
            setChatbotOpen(!chatbotOpen); // mở/đóng chatbot
          }}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: "#1976d2", // Hoặc màu thương hiệu của bạn
            // Nếu đang mở thì tắt hiệu ứng rung, nếu đóng thì bật rung
            animation: isOpen
              ? "none"
              : `${shakeAnimation} 1s cubic-bezier(.36,.07,.19,.97) both infinite, ${rippleAnimation} 1.5s infinite`,
            "&:hover": {
              animation: "none", // Rê chuột vào thì dừng rung
              backgroundColor: "#1565c0",
            },
          }}
        >
          {isOpen ? (
            <CloseIcon sx={{ fontSize: 30 }} />
          ) : (
            <HeadsetMicIcon sx={{ fontSize: 30 }} />
          )}
        </Fab>
      </Box>
      {/* --- DANH SÁCH CÁC NÚT CON --- */}
      {contacts.map((item, index) => (
        <Zoom
          in={isOpen}
          key={index}
          style={{ transitionDelay: isOpen ? `${index * 100}ms` : "0ms" }}
        >
          <Tooltip title={item.name} placement="left" arrow>
            <Fab
              component={Link}
              href={item.href}
              target="_blank"
              underline="none"
              size="medium"
              sx={{
                backgroundColor: "white",
                color: item.color,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  backgroundColor: item.color,
                  color: "white",
                },
              }}
            >
              {item.icon}
            </Fab>
          </Tooltip>
        </Zoom>
      ))}
    </Box>
  );
}
