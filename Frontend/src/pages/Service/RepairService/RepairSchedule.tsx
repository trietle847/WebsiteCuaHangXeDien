import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
} from "@mui/material";
// import repairScheduleApi from "../../../services/repairSchedule.api";
import { useAuth } from "../../../context/AuthContext";
import repairApi from "../../../services/repair.api";

const RepairBooking: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>(""); // thời gian được chọn
  // const [mechanic, setMechanic] = useState<string>("");
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
    const fetchBookedTimes = async () => {
      if ( !date) return;
      try {
        const response = await repairApi.getTimeRepair(
          date
        );
        console.log(response);
        setBookedTimes(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy giờ đã đặt:", err);
      }
    };

    fetchBookedTimes();
  }, [date]);

  const handleSubmit = async () => {
    if (!date || !time ) {
      alert("Vui lòng chọn đủ ngày, giờ và kỹ thuật viên!");
      return;
    }

    try {
      const data = {
        customer_id: userInfo.user_id,
        repair_date: date,
        repair_time: time,
        description: description,
      };

      const response = await repairApi.create(data);
      console.log(data);
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

            <Typography fontWeight="bold">Ngày đăng ký: {date}</Typography>

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
                  setDescription("");
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
