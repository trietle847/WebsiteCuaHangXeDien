import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Grid,
  MenuItem,
} from "@mui/material";

import { useAuth } from "../../../context/AuthContext";
import InfoSection from "../Profile/InfoSession";
import PasswordSection from "./PasswordSection";
import OrdersSection from "./OrdersSection";
import userApi from "../../../services/user.api";

export default function UserProfile() {
  const [selected, setSelected] = useState("info");
  const [user, setUser] = useState<any[]>([]);
  const { logout } = useAuth();

  // const [passwordData, setPasswordData] = useState({
  //   oldPassword: "",
  //   newPassword: "",
  //   confirmPassword: "",
  // });
  const [orders] = useState([
    {
      id: "DH001",
      date: "2025-09-21",
      total: "12,000,000₫",
      status: "Đã giao",
    },
    {
      id: "DH002",
      date: "2025-10-01",
      total: "2,500,000₫",
      status: "Đang giao",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await userApi.getInfoByUsername();
      console.log(response);
      setUser(response.data);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 5, mb: 10, p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
          gap: 4,
        }}
      >
        <Box marginRight={5}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            TRANG TÀI KHOẢN
          </Typography>
          <Typography mb={2}>
            Xin chào, {user.first_name} {user.last_name} !
          </Typography>
          <List sx={{ borderRight: "1px solid #ddd" }}>
            <ListItemButton
              selected={selected === "info"}
              onClick={() => setSelected("info")}
            >
              <ListItemText primary="Thông tin tài khoản" />
            </ListItemButton>
            <ListItemButton
              selected={selected === "orders"}
              onClick={() => setSelected("orders")}
            >
              <ListItemText primary="Đơn hàng của bạn" />
            </ListItemButton>
            <ListItemButton
              selected={selected === "password"}
              onClick={() => setSelected("password")}
            >
              <ListItemText primary="Đổi mật khẩu" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={() => {
                logout();
              }}
              sx={{ color: "error.main" }}
            >
              Đăng xuất
            </MenuItem>
          </List>
        </Box>

        <Box>
          {selected === "info" && <InfoSection user={user} setUser={setUser} />}
          {selected === "orders" && <OrdersSection orders={orders} />}
          {selected === "password" && <PasswordSection />}
        </Box>
      </Box>
    </Box>
  );
}
