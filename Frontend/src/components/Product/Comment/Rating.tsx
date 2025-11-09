import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ratingApi from "../../../services/rating.api";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";

export default function Rating({ product_id }: { product_id: string }) {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkPurchased, setCheckPurchased] = useState<boolean>(false);

  // Hàm fetch cả ratings và check purchased
  const fetchData = async () => {
    setLoading(true);
    try {
      const ratingsRes = await ratingApi.getAllByProductId(product_id);
      const purchasedRes = await ratingApi.checkPurchased(product_id);
      setRatings(ratingsRes.data);
      // Lấy đúng giá trị purchased từ response.data
      setCheckPurchased(purchasedRes.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [product_id]);

  // Xử lý khi người dùng gửi bình luận
  const onSubmit = async (data: any) => {
    console.log("Đánh giá đã được gửi:", data);
    try {
      const response = await ratingApi.createRating(product_id, data);
      if (response) {
        alert("Đánh giá thành công!");
      }
      fetchData(); // load lại danh sách và trạng thái purchased
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      {/* Form nhập bình luận */}
      {checkPurchased ? (
        <CommentForm onSubmit={onSubmit} status={true} />
      ) : (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Bạn chỉ có thể đánh giá sản phẩm sau khi mua.
        </Typography>
      )}

      {/* Hiển thị danh sách bình luận */}
      {loading ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : ratings.length === 0 ? (
        <Typography color="text.secondary">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </Typography>
      ) : (
        ratings.map((rating) => (
          <CommentCard key={rating.rating_id} comment={rating} rating={true} />
        ))
      )}
    </Box>
  );
}
