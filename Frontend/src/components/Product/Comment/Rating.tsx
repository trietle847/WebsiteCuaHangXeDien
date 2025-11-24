import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Stack,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Edit as EditIcon } from "@mui/icons-material";
import ratingApi from "../../../services/rating.api";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";

export default function Rating({ product_id }: { product_id: string }) {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkPurchased, setCheckPurchased] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<any | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // số bình luận mỗi trang
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ratingsRes = await ratingApi.getAllByProductId(product_id, {
        page,
        limit,
      });

      setRatings(ratingsRes.data.data);
      setTotalPages(ratingsRes.data.totalPages || 1);

      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");

      if (token) {
        setIsLoggedIn(true);
        const purchasedRes = await ratingApi.checkPurchased(product_id);
        setCheckPurchased(purchasedRes.data);
        const myRatingRes = await ratingApi.getMyRating(product_id);
        setUserRating(myRatingRes.data || null);
      } else {
        setIsLoggedIn(false);
        setCheckPurchased(false);
        setUserRating(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [product_id, page]);

  const onSubmit = async (data: any) => {
    try {
      if (editing && userRating) {
        const res = await ratingApi.update(userRating.rating_id, data);
        if (res) {
          alert("Cập nhật đánh giá thành công!");
          setUserRating((prev: any) => ({ ...prev, ...data }));
        }
      } else {
        const res = await ratingApi.createRating(product_id, data);
        if (res) alert("Đánh giá thành công!");
      }

      setEditing(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Box sx={{ mt: 5 }}>
      {/* Form đánh giá */}
      {isLoggedIn ? (
        userRating ? (
          <Box sx={{ mb: 3, border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontWeight="bold" color="primary">
                Đánh giá của bạn
              </Typography>
              <IconButton
                onClick={() => setEditing(!editing)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Stack>

            {editing ? (
              <CommentForm
                onSubmit={onSubmit}
                status={true}
                initialData={userRating}
              />
            ) : (
              <CommentCard comment={userRating} rating={true} />
            )}
          </Box>
        ) : checkPurchased ? (
          <CommentForm onSubmit={onSubmit} status={true} />
        ) : (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Bạn chỉ có thể đánh giá sản phẩm sau khi mua.
          </Typography>
        )
      ) : (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Vui lòng đăng nhập để đánh giá sản phẩm.
        </Typography>
      )}

      {/* Danh sách bình luận */}
      {loading ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : ratings.length === 0 ? (
        <Typography color="text.secondary">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </Typography>
      ) : (
        <>
          {ratings
            // .filter((r) => r.user_id !== userRating?.user_id)
            .map((rating) => (
              <CommentCard
                key={rating.rating_id}
                comment={rating}
                rating={true}
              />
            ))}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
