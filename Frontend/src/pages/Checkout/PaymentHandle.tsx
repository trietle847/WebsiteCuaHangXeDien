import { Box } from "@mui/material";
import paymentApi from "../../services/payment.api";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function PaymentHandle() {
  const [searchParams] = useSearchParams();

  const payload = Object.fromEntries([...searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["handleMomoIPN"],
    queryFn: () => paymentApi.handleMomoIPN(payload),
  });

  return (
    <Box>
      {isLoading && <Box>Đang xử lý thanh toán...</Box>}
      {error && <Box>Lỗi khi xử lý thanh toán: {(error as Error).message}</Box>}
      {data && data?.message && <Box>{data?.message}</Box>}
      <Link to="/orders">Đến giỏ hàng</Link>
    </Box>
  );
}
