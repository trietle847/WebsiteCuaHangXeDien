import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Box, Alert } from "@mui/material";
import userApi from "../../../services/user.api";

type PasswordData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function PasswordSection() {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { oldPassword, newPassword, confirmPassword } = passwordData;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const hasMinLength = newPassword.length >= 8;
  const isPasswordValid = hasUppercase && hasSpecialChar && hasMinLength;

  const handleChangePassword = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);


    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Mật khẩu mới chưa đáp ứng yêu cầu bảo mật.");
      return;
    }

    try {
      setLoading(true);
      await userApi.updateUser({ password: newPassword });
      setSuccessMessage("Đổi mật khẩu thành công!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setErrorMessage("Đổi mật khẩu thất bại. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        // mt: 3,
        marginLeft: 1
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Đổi mật khẩu
      </Typography>

      <TextField
        label="Mật khẩu cũ"
        type="password"
        fullWidth
        value={oldPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, oldPassword: e.target.value })
        }
      />

      <TextField
        label="Mật khẩu mới"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, newPassword: e.target.value })
        }
      />

      <TextField
        label="Xác nhận mật khẩu mới"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
        }
      />

      {errorMessage && (
        <Alert severity="error" sx={{ textAlign: "left" }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ textAlign: "left" }}>
          {successMessage}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleChangePassword}
        disabled={loading}
        sx={{ width: "fit-content", alignSelf: "flex-start" }}
      >
        {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
      </Button>
    </Box>
  );
}
