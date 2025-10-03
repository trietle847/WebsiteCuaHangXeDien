import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import type { LoginData } from "../../services/user.service"; // nếu bạn có type riêng
import userApi from "../../services/user.api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: LoginData = { username, password };
    try {
      const response = await userApi.login(data);
      await login(response.token); 
      navigate("/");
    } catch (error) {
      setErrorMessage("Sai thông tin đăng nhập.");
      console.error(error);
    }
  };

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
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Tên đăng nhập"
            name="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container justifyContent="center" sx={{ mt: 1 }}>
            <Grid>
              <Link
                component={RouterLink}
                to="/forget"
                variant="body2"
                sx={{ fontSize: 14, color: "#0086FF" }}
              >
                Quên mật khẩu?
              </Link>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>

          <Grid container justifyContent="center">
            <Grid>
              <Link component={RouterLink} to="/register" variant="body2">
                Chưa có tài khoản? Đăng ký
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
