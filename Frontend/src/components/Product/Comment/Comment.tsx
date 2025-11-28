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
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import commentApi from "../../../services/comment.api";
import CustomPagination from "../Pagination";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";

export default function ProductComment({ product_id }: { product_id: string }) {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const role = userInfo?.role;
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const itemsPerPage = 5;
  useEffect(() => {
    fetchComments(page);
  }, [page, product_id]);

  const fetchComments = async (pageNumber: number) => {
    try {
      setLoading(true);
      let response;
      if (role == "admin") {
        setCheckAdmin(true);
        response = await commentApi.getAllById(product_id, {
          page: pageNumber,
          limit: itemsPerPage,
        });
      } else {
        response = await commentApi.getAllByVisitors(product_id, {
          page: pageNumber,
          limit: itemsPerPage,
        });
      }

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
  const handleToggleComment = async (id: number, status: boolean) => {
    try {
      if (status) await commentApi.deactivate(id);
      else await commentApi.activate(id);
    } catch (err) {
      console.error("Lỗi toggle status:", err);
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
    };

    try {
      await commentApi.createById(product_id, newComment);
      fetchComments(page); // tải lại page hiện tại
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <CommentForm onSubmit={onSubmit} status={false} />
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
            <CommentCard
              key={comment.feedback_id}
              comment={comment}
              rating={false}
              checkAdmin={checkAdmin}
              handleToggleComment={handleToggleComment}
            />
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
