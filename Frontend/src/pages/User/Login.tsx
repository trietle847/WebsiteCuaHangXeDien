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
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { LoginData } from "../../services/user.service";
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
      console.log(response);
      await login(response.data.token);
      navigate("/");
    } catch (error) {
      setErrorMessage("Sai thông tin đăng nhập.");
      console.error(error);
    }
  };

  const handleLoginWithGoogle = async () => {
      window.location.href = "http://localhost:3000/user/google/";
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)", 
                      p: 1.2, 
                    }}
                  >
                    <Box
                      component="img"
                      src="/logo/logo_home.png"
                      alt="Logo"
                      sx={{
                        width: "90%", 
                        height: "90%",
                        objectFit: "contain",
                        borderRadius: "50%", 
                      }}
                    />
                  </Avatar>
                </Box>
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
                sx={{
                  fontSize: 14,
                  color: "#0086FF",
                  ":hover": { textDecoration: "underline" },
                }}
              >
                Quên mật khẩu?
              </Link>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Đăng nhập
          </Button>

          <Divider sx={{ my: 1.5 }}>Hoặc</Divider>

          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleLoginWithGoogle}
            sx={{
              textTransform: "none",
              border: "none",
            }}
          >
            Đăng nhập bằng Google
          </Button>

          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid>
              Chưa có tài khoản?{" "}
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{
                  ":hover": { textDecoration: "underline" },
                  fontSize: 16,
                  color: "#1976d2",
                }}
              >
                Đăng ký
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
