import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  // Checkbox,
  // FormGroup,
  // FormControlLabel,
  Button,
  Select,
  MenuItem,
  Paper,
  Divider,
  InputLabel,
  FormControl,
} from "@mui/material";
import userApi from "../../../services/user.api";
// import repairScheduleApi from "../../../services/repairSchedule.api";
import { useAuth } from "../../../context/AuthContext";
import repairApi from "../../../services/repair.api";

const RepairBooking: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>(""); // thời gian được chọn
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [mechanic, setMechanic] = useState<string>("");
  const [mechanicInfo, setMechanicInfo] = useState<any>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) {
      setCustomerName(userInfo.first_name + " " + userInfo.last_name);
      setCustomerPhone(userInfo.phone);
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await userApi.getAll();
        const filtered = response.data.filter((user) =>
          user.Roles.some((role) => role.name === "mechanic")
        );
        setMechanics(filtered);
      } catch (error) {
        console.error("Lỗi khi tải danh sách kỹ thuật viên:", error);
      }
    };

    fetchMechanics();
  }, []);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!mechanic || !date) return;
      try {
        const response = await repairApi.getTimeRepairOfMechanic(
          mechanic,
          date
        );
        console.log(response);
        setBookedTimes(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy giờ đã đặt:", err);
      }
    };

    fetchBookedTimes();
  }, [mechanic, date]);

  const getMechanic = async (userId: string) => {
    try {
      const response = await userApi.getById(userId);
      const fullname = response.data.first_name + " " + response.data.last_name;
      setMechanicInfo(fullname);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin kỹ thuật viên:", err);
    }
  };

  const handleSubmit = async () => {
    if (!date || !time || !mechanic) {
      alert("Vui lòng chọn đủ ngày, giờ và kỹ thuật viên!");
      return;
    }

    try {
      const data = {
        customer_id: userInfo.user_id,
        mechanic_id: mechanic,
        repair_date: date,
        repair_time: time,
        description: description,
      };

      const response = await repairApi.create(data);
      console.log("Lịch đã tạo:", response.data);
    } catch (err) {
      console.error("Lỗi khi tạo lịch sửa:", err);
      alert("Không thể tạo lịch. Vui lòng thử lại!");
    }
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <Grid container spacing={3} wrap="nowrap" justifyContent={"center"}>
        {/* BÊN TRÁI */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Đăng ký lịch sửa chữa xe điện
            </Typography>

            <Grid container spacing={2} flexDirection={"column"}>
              <Grid item>
                <TextField
                  fullWidth
                  label="Tên khách hàng"
                  size="small"
                  value={customerName}
                  disabled
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  size="small"
                  value={customerPhone}
                  disabled
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Ngày đến sửa"
                  size="small"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item>
                <FormControl fullWidth size="small">
                  <InputLabel>Chọn kỹ thuật viên</InputLabel>
                  <Select
                    value={mechanic}
                    label="Chọn kỹ thuật viên"
                    onChange={(e) => {
                      setMechanic(e.target.value);
                      getMechanic(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>-- Chọn kỹ thuật viên --</em>
                    </MenuItem>
                    {mechanics.map((m) => (
                      <MenuItem key={m.user_id} value={m.user_id}>
                        {m.first_name} {m.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Ghi chú"
                  size="small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* BÊN PHẢI */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Tổng quan
            </Typography>

            <Typography fontWeight="bold">Chọn ngày: {date}</Typography>
            <Typography>
              Kỹ thuật viên: <b>{mechanicInfo}</b>
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="bold" mb={1}>
              Khung giờ trống
            </Typography>
            <Grid container spacing={1}>
              {[
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
              ].map((t) => {
                const isBooked = bookedTimes.includes(t);
                return (
                  <Grid item key={t}>
                    <Button
                      variant={time === t ? "contained" : "outlined"}
                      size="small"
                      disabled={isBooked}
                      onClick={() => !isBooked && setTime(t)}
                      sx={{
                        minWidth: "60px",
                        color: "black",
                        backgroundColor: isBooked
                          ? "#ffcdd2" // có người chọn r
                          : time === t
                          ? "#81c784" // đang chọn
                          : "#e8f5e9", // trống
                        cursor: isBooked ? "not-allowed" : "pointer",
                      }}
                    >
                      {t}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid item xs={12} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Đặt lịch
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setDate("");
                  setTime("");
                  setMechanic("");
                  setDescription("");
                  setMechanic("");
                  setMechanicInfo("");
                }}
              >
                Xóa nhanh
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RepairBooking;
