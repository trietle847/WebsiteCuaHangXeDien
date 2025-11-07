import { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import userApi from "../../../services/user.api";

export default function InfoSection({ user, setUser }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const res = await userApi.updateUser(formData);
      console.log(res);
      setUser(res.data); 

      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Cập nhật thất bại, vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  return (
    <Box>
      <Typography variant="h6" mb={2} fontWeight={600}>
        THÔNG TIN TÀI KHOẢN
      </Typography>

      <Stack spacing={2} mt={3}>
        {editMode ? (
          <>
            <TextField
              label="Họ lót"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Tên"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              fullWidth
            />
            <TextField
              label="Địa chỉ"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              fullWidth
            />
          </>
        ) : (
          <>
            <Typography>
              <strong>Họ tên:</strong> {user.last_name} {user.first_name}
            </Typography>
            <Typography>
              <strong>Tên đăng nhập:</strong> {user.username}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Số điện thoại:</strong> {user.phone}
            </Typography>
            <Typography>
              <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}
            </Typography>
          </>
        )}
      </Stack>

      {message.text && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        {editMode ? (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{ borderRadius: "12px", px: 3, py: 1 }}
            >
              {loading ? <CircularProgress size={20} /> : "Lưu thay đổi"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CloseIcon />}
              onClick={handleCancel}
              sx={{ borderRadius: "12px", px: 3, py: 1 }}
            >
              Hủy
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            sx={{ borderRadius: "12px", px: 3, py: 1 }}
          >
            Cập nhật thông tin
          </Button>
        )}
      </Box>
    </Box>
  );
}
