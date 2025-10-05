import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import userApi from "../../services/user.api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Kiểm tra các điều kiện mật khẩu
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  const strength = [hasUppercase, hasSpecialChar, hasMinLength].filter(
    Boolean
  ).length;
  const isPasswordValid = strength === 3;

  const getStrengthColor = () => {
    if (strength === 0) return "error"; 
    if (strength === 1) return "warning"; 
    if (strength === 2) return "info"; 
    return "success"; 
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Mật khẩu chưa đáp ứng đủ yêu cầu !");
      return;
    }

    try {
      const response = await userApi.create({
        username,
        email,
        password,
        first_name,
        last_name,
        phone,
      });
      console.log(response);

      setSuccessMessage("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      setErrorMessage(null);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      console.log(error);
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(err.response?.data?.message || "Đăng ký thất bại");
      setSuccessMessage(null);
    }
  };

  const PasswordRule = ({
    label,
    valid,
  }: {
    label: string;
    valid: boolean;
  }) => (
    <Typography
      variant="body2"
      sx={{
        display: "flex",
        alignItems: "center",
        color: valid ? "green" : "gray",
      }}
    >
      {valid ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
      <span style={{ marginLeft: 4 }}>{label}</span>
    </Typography>
  );

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Đăng ký để trở thành eMEMBER
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tên đăng nhập"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Tên"
            name="last_name"
            autoFocus
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="Họ lót"
            name="first_name"
            autoFocus
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Số Điện thoại"
            name="phone"
            autoComplete="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {password && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={(strength / 3) * 100}
                color={getStrengthColor()}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                {strength === 0 && "Mật khẩu rất yếu"}
                {strength === 1 && "Mật khẩu yếu"}
                {strength === 2 && "Mật khẩu trung bình"}
                {strength === 3 && "Mật khẩu mạnh"}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 1, mb: 1 }}>
            <PasswordRule label="Có ít nhất 1 chữ hoa" valid={hasUppercase} />
            <PasswordRule
              label="Có ít nhất 1 ký tự đặc biệt"
              valid={hasSpecialChar}
            />
            <PasswordRule
              label="Độ dài từ 8 ký tự trở lên"
              valid={hasMinLength}
            />
          </Box>

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isPasswordValid}
          >
            Đăng ký
          </Button>

          <Grid container justifyContent="center">
            <Grid>
              <Typography variant="body2">
                Đã có tài khoản?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "#1976d2",
                    fontSize: 16,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Đăng nhập
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
