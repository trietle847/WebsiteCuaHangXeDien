import { Box } from "@mui/material";
import paymentApi from "../../services/payment.api";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// partnerCode=MOMOHC9O20251117_TEST&orderId=46&requestId=46&amount=10000&orderInfo=Thanh+toán+đơn+hàng+%2346&orderType=momo_wallet&transId=4612458835&resultCode=0&message=Thành+công.&payType=qr&responseTime=1763447385808&extraData=&signature=16ab09ccaa75df5ec68219ecd63592ca0164e4843035412ca049656cfd34d6c6

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
