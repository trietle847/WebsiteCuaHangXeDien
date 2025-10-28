import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import commentApi from "../../services/comment.api";
import CustomPagination from "./Pagination";

export default function ProductComment() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { content: "" },
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await commentApi.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.comments || response.data?.comments || [];
      setComments(data);
    } catch (e) {
      console.error("Lỗi lấy danh sách comment:", e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!userInfo) {
      if (
        window.confirm(
          "Bạn cần đăng nhập để bình luận. Chuyển đến trang đăng nhập?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    const newComment = {
      ...data,
      createdAt: new Date().toISOString(),
      user_id: userInfo.user_id,
    };

    try {
      await commentApi.create(newComment);
      reset();
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };
  const currentComments = comments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ mt: 5 }}>
      {/* Tiêu đề */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Đánh giá sản phẩm
      </Typography>

      {/* Form nhập bình luận */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="subtitle1" fontWeight="500">
          Thêm đánh giá của bạn
        </Typography>

        <Controller
          name="content"
          control={control}
          rules={{ required: "Vui lòng nhập nội dung bình luận" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              multiline
              rows={3}
              placeholder="Nhập bình luận của bạn..."
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ alignSelf: "flex-end", px: 3, borderRadius: 2 }}
        >
          Gửi bình luận
        </Button>
      </Box>

      {/* Hiển thị danh sách bình luận */}
      {loading ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : currentComments.length === 0 ? (
        <Typography color="text.secondary">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </Typography>
      ) : (
        <>
          {currentComments.map((comment) => (
            <Box
              key={comment.feedback_id || comment.id}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: "1px solid #eee",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {comment.user?.first_name?.[0]?.toUpperCase() || "U"}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold">
                    {comment.user?.username || `Người dùng #${comment.user_id}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ mt: 1.5, ml: 7 }}>{comment.content}</Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}

          {/* Phân trang */}
          <CustomPagination
            totalItems={comments.length}
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </Box>
  );
}
