import React, { useState, useEffect, useCallback } from "react";
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
import AddressSelector from "../../../components/AddressSelector";

export interface User {
  id?: string | number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  address?: string; 
}

interface InfoSectionProps {
  user: User;
  setUser: (user: User) => void;
}

interface MessageState {
  type: "success" | "error" | ""; 
  text: string;
}

export default function InfoSection({ user, setUser }: InfoSectionProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<User>(user);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: "", text: "" });

  const [newAddress, setNewAddress] = useState<string | null>(null);

  useEffect(() => {
    setFormData(user);
    setNewAddress(null); 
  }, [user]);

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = useCallback((address: string) => {

    setNewAddress(address);
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const updatedData: User = { ...formData };

      if (newAddress && newAddress.length > 0) {
        updatedData.address = newAddress;
      }

      const res = await userApi.updateUser(updatedData);

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
    setNewAddress(null);
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
              label="Họ"
              value={formData.first_name || ""}
              onChange={(e) => handleChange("first_name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Tên"
              value={formData.last_name || ""}
              onChange={(e) => handleChange("last_name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              fullWidth
            />

            <AddressSelector
              onAddressChange={handleAddressChange}
              initialAddress={formData.address}
            />

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: newAddress ? "primary.main" : "text.secondary",
              }}
            >
              **Địa chỉ sẽ lưu:**{" "}
              {newAddress || formData.address || "Chưa chọn địa chỉ mới"}
            </Typography>
          </>
        ) : (
          <>
            <Typography>
              <strong>Họ tên:</strong> {user.first_name} {user.last_name}
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
        <Alert severity={message.type || "info"} sx={{ mt: 2 }}>
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
