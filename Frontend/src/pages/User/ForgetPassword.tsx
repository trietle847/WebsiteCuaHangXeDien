import { Box, TextField, Typography, Avatar, Button } from "@mui/material";
import userApi from "../../services/user.api";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { textValidation } from "../../lib/entities/form/inputConfig";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "" as string,
    },
  });

const [timer, setTimer] = useState<number | null>(
    sessionStorage.getItem("forgetPasswordTimer")
        ? Number(sessionStorage.getItem("forgetPasswordTimer"))
        : null
);

const mutation = useMutation({
    mutationFn: (email: string) => userApi.forgetPassword(email),
    onSuccess: () => {
        // Bắt đầu đếm ngược thời gian
        toast.success("Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.");
        setTimer(30);
    },
    onError: (error: any) => {
        toast.error(
            error?.message ||
            `Gửi yêu cầu đặt lại mật khẩu thất bại! Hãy thử lại sau.`
        );
    }
});

const navigate = useNavigate();

// Đảm bảo interval tiếp tục chạy khi reload trang
useEffect(() => {
    if (timer && timer > 0) {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev && prev > 1) {
                    sessionStorage.setItem("forgetPasswordTimer", String(prev - 1));
                    return prev - 1;
                } else {
                    clearInterval(interval);
                    sessionStorage.removeItem("forgetPasswordTimer");
                    return null;
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }
}, [timer]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        marginTop: 8,
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        gap: 1,
      }}
      component="form"
      noValidate
      onSubmit={handleSubmit((data) => {
        mutation.mutate(data.email);
      })}
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
        Quên mật khẩu
      </Typography>
      <Typography variant="body1" align="center">
        Vui lòng nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
      </Typography>
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: "Email là bắt buộc",
          ...textValidation.email,
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            margin="normal"
            required
            sx={{
              width: "70%",
              maxWidth: 500,
            }}
            id="email"
            label="Email"
            name="email"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            autoFocus
          />
        )}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{
          maxWidth: 450,
        }}
      >
        Nếu bạn không nhận được mail, có thể gửi lại yêu cầu trong vòng 30 giây
        hoặc thử liên hệ với bộ phận hỗ trợ.
      </Typography>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!!timer}
      >
        {timer ? `Gửi lại (${timer}s)` : "Gửi yêu cầu"}
      </Button>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{
            "&:hover": {
                color: "black",
                cursor: "pointer",
            }
        }}
        onClick={() => navigate(-1)}
      >
       Quay lại trang đăng nhập
      </Typography>
    </Box>
  );
}
