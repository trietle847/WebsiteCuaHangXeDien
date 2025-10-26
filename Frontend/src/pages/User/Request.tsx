import {
  CircularProgress,
  LinearProgress,
  Box,
  TextField,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import { Cancel, CheckCircle, SearchOff } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import userApi from "../../services/user.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const BadRequestComponent = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      height: "80vh",
      gap: 2,
    }}
  >
    <Typography variant="h5" gutterBottom>
      Yêu cầu không hợp lệ
    </Typography>
    <SearchOff sx={{ fontSize: 80, color: "error.main" }} />
    <Typography
      variant="body1"
      fontWeight={"bold"}
      color="text.secondary"
      component={Link}
      to={"/login"}
    >
      Quay lại trang đăng nhập
    </Typography>
  </Box>
);

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const checks = [
    {
      label: "Ít nhất 8 ký tự",
      test: password.length >= 8,
    },
    {
      label: "Có chữ hoa (A-Z)",
      test: /[A-Z]/.test(password),
    },
    {
      label: "Có ký tự đặc biệt (!@#$%...)",
      test: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passedChecks = checks.filter((c) => c.test).length;
  const progress = (passedChecks / checks.length) * 100;

  // Màu theo độ mạnh
  const getColor = () => {
    if (passedChecks === 0) return "error";
    if (passedChecks === 1) return "warning";
    if (passedChecks === 2) return "info";
    return "success";
  };

  const strengthText = () => {
    if (passedChecks === 0) return "Yếu";
    if (passedChecks === 1) return "Trung bình";
    if (passedChecks === 2) return "Khá";
    return "Mạnh";
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* ✅ Progress bar với màu động */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={getColor()}
          sx={{
            flexGrow: 1,
            height: 8,
            borderRadius: 2,
          }}
        />
        <Typography
          variant="caption"
          color={`${getColor()}.main`}
          sx={{ fontWeight: 600, minWidth: 80 }}
        >
          {strengthText()}
        </Typography>
      </Box>

      <List dense sx={{ py: 0 }}>
        {checks.map((check, index) => (
          <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {check.test ? (
                <CheckCircle sx={{ fontSize: 20, color: "success.main" }} />
              ) : (
                <Cancel sx={{ fontSize: 20, color: "text.disabled" }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={check.label}
              primaryTypographyProps={{
                variant: "caption",
                color: check.test ? "success.main" : "text.secondary",
                fontWeight: check.test ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default function Request() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (token && token.length !== 64) {
    return <BadRequestComponent />;
  }

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["activate", token],
    queryFn: async () => await userApi.verifyToken(token || ""),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (newPassword: string) =>
      userApi.resetPassword(token || "", newPassword),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
    },
  });

  const fields = [
    { name: "username", label: "Tên đăng nhập" },
    { name: "email", label: "Email" },
    { name: "first_name", label: "Tên" },
    { name: "last_name", label: "Họ" },
  ];

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Box>
      {isSuccess && (
        <Box>
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
          <Typography variant="h5" gutterBottom>
            Đặt lại mật khẩu
          </Typography>
        </Box>
      )}
      {isLoading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
          }}
          size={100}
        />
      )}
      {isError && <BadRequestComponent />}
      {isSuccess && (
        <Box
          sx={{
            width: {
              sx: "100%",
              md: "60%",
            },
            maxWidth: 500,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontStyle: "italic",
              mb: 2,
            }}
          >
            Thông tin tài khoản
          </Typography>
          {fields?.map((field) => (
            <TextField
              key={field.name}
              {...field}
              variant="outlined"
              value={data.user[field.name]}
              sx={{
                mb: 2,
              }}
              disabled
              fullWidth
            />
          ))}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontStyle: "italic",
              mb: 2,
            }}
          >
            Nhập mật khẩu mới
          </Typography>
          <ToastContainer />
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit((data) => {
              mutation.mutateAsync(data.password);
            })}
          >
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
                validate: {
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) || "Mật khẩu phải có chữ hoa",
                  hasNumber: (value) =>
                    /[0-9]/.test(value) || "Mật khẩu phải có số",
                  hasSpecial: (value) =>
                    /[^A-Za-z0-9]/.test(value) ||
                    "Mật khẩu phải có ký tự đặc biệt",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  type="password"
                  {...field}
                  label="Mật khẩu mới"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <PasswordStrengthIndicator password={password} />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === password || "Mật khẩu xác nhận không khớp",
              }}
              render={({ field, fieldState }) => (
                <TextField
                  type="password"
                  {...field}
                  label="Nhập lại mật khẩu"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Button sx={{ display: "block", mx: "auto" }} type="submit">
              Đặt mật khẩu
            </Button>
            <Box>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={Link}
                  to={"/login"}
                >
                  Quay lại trang đăng nhập
                </Typography>
                |
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={Link}
                  to={"/"}
                >
                  Đến trang chủ
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
