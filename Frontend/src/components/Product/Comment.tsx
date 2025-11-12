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

export default function ProductComment({ product_id }: { product_id: string }) {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { content: "" },
  });

  useEffect(() => {
    fetchComments(page);
  }, [page, product_id]);

  const fetchComments = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await commentApi.getAllById(product_id, {
        page: pageNumber,
        limit: itemsPerPage,
      });
      console.log("Comments response:", response);

      setComments(response.data);
      setTotalPages(response.totalPages);
      setPage(response.currentPage);
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
        navigate("/login", { state: { from: location.pathname } });
      }
      return;
    }

    const newComment = {
      ...data,
      user_id: userInfo.user_id,
    };

    try {
      await commentApi.createById(product_id, newComment);
      reset();
      fetchComments(page); // tải lại page hiện tại
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

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
      ) : comments.length === 0 ? (
        <Typography color="text.secondary">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </Typography>
      ) : (
        <>
          {comments.map((comment) => (
            <Box
              key={comment.feedback_id || comment.id}
              sx={{
                mb: 3,
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 5px rgba(0,0,0,0.08)",
                backgroundColor: "#ffffff",
                transition: "transform 0.1s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 48,
                    height: 48,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {comment.User?.first_name?.[0]?.toUpperCase() || "U"}
                </Avatar>
                <Box>
                  <Typography
                    fontWeight="600"
                    color="#1976d2"
                    sx={{ fontSize: 16 }}
                  >
                    {comment.User
                      ? `${comment.User.first_name} ${comment.User.last_name}`
                      : `Người dùng #${comment.user_id}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  mt: 1.5,
                  ml: 10,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  fontSize: 15,
                  color: "#333",
                }}
              >
                {comment.content}
              </Typography>
              <Divider sx={{ mt: 2, ml: 10 }} />
            </Box>
          ))}

          {/* Phân trang */}
          <CustomPagination
            totalItems={totalPages * itemsPerPage}
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </Box>
  );
}
