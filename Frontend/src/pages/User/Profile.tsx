import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import userApi from "../../services/user.api";

export default function UserProfile() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    address: "123 Nguyễn Trãi, Hà Nội",
  });

  const [info, setInfo] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const response = await userApi.getInfoByUsername();
        setInfo(response.data)
        console.log(response.data);
    }
    fetchData()
  },[])

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const orders = [
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
  ];

  const handleChange = (event, newValue) => setTab(newValue);

  const handleUpdateProfile = () => alert("Cập nhật thông tin thành công!");
  const handleChangePassword = () => alert("Đổi mật khẩu thành công!");

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, p: 3 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              mb: 3,
            }}
          >
            <Avatar
              src="https://i.pravatar.cc/150?img=12"
              alt={user.name}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h5" fontWeight={700}>
              {user.name}
            </Typography>
            <Typography color="text.secondary">{info.email}</Typography>
          </Box>

          <Tabs value={tab} onChange={handleChange} centered sx={{ mb: 3 }}>
            <Tab label="Thông tin cá nhân" />
            <Tab label="Đổi mật khẩu" />
            <Tab label="Lịch sử mua hàng" />
          </Tabs>

          {tab === 0 && (
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Họ và tên"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <TextField
                label="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <TextField
                label="Số điện thoại"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
              <TextField
                label="Địa chỉ"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
              >
                Lưu thay đổi
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Mật khẩu cũ"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
              />
              <TextField
                label="Mật khẩu mới"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
              <TextField
                label="Xác nhận mật khẩu mới"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleChangePassword}
              >
                Đổi mật khẩu
              </Button>
            </Box>
          )}

          {tab === 2 && (
            <List>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Mã đơn: ${order.id}`}
                      secondary={`Ngày: ${order.date} | Tổng: ${order.total} | Trạng thái: ${order.status}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
