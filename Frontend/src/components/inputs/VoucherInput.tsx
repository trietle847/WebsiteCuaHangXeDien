import promotionApi from "../../services/promotion.api";
import { Box, Autocomplete, TextField, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { Promotion } from "../../lib/types";
import { format } from "date-fns/format";
import { useState, useMemo, useEffect } from "react";

interface VoucherInputProps {
  orderValue?: number;
  onChange: (value: Promotion | null) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export default function VoucherInput({ orderValue, onChange }: VoucherInputProps) {
  const { data } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => promotionApi.getAll(),
  });

  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const promotions = (data?.data as Promotion[]) || [];

  const memoizedOptions = useMemo(() => {
    // Nếu không có orderValue, không tính toán gì cả
    if (orderValue === undefined || orderValue === null) {
      return promotions.map((p) => ({
        ...p,
        disabled: true,
        decreasedValue: 0,
      }));
    }

    const calculatedPromos = promotions.map((promo) => {
      let disabled = false;
      let decreasedValue = 0;

      // Tính disabled
      if (promo.minimum_order_value && orderValue < promo.minimum_order_value) {
        disabled = true;
      }

      // Tính decreasedValue (ngay cả khi disabled, để sort)
      if (promo.discount_type === "percentage") {
        const discountAmount = (orderValue * promo.discount_value) / 100;
        decreasedValue = promo.max_discount_amount
          ? Math.min(discountAmount, promo.max_discount_amount)
          : discountAmount;
      } else {
        decreasedValue = promo.discount_value;
      }

      return {
        ...promo,
        disabled,
        decreasedValue, // Gán giá trị đã tính
      };
    });

    // Sắp xếp
    return calculatedPromos.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return b.decreasedValue - a.decreasedValue; // Sắp xếp theo giá trị giảm
    });
  }, [promotions, orderValue]);

  useEffect(()=>{
    if (
      selectedPromo &&
      selectedPromo.minimum_order_value != null &&
      orderValue !== undefined &&
      orderValue < selectedPromo.minimum_order_value
    ) {
      setSelectedPromo(null);
      onChange(null);
    }
  },[orderValue])

  return (
    <Box>
      <Autocomplete
        options={memoizedOptions}
        getOptionLabel={(option) => option.code}
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            key={option.promotion_id}
            disabled={option.disabled}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <i>{option.code} </i>
              <span>
                Giảm{" "}
                {option.discount_type === "percentage"
                  ? `${option.discount_value}%`
                  : `${formatCurrency(option.discount_value)}`}
                {option.minimum_order_value && (
                  <span>
                    {" "}
                    cho đơn hàng tối thiểu:{" "}
                    {formatCurrency(option.minimum_order_value)}
                  </span>
                )}
                {option.max_discount_amount &&
                  option.discount_type === "percentage" && (
                    <span>
                      {" "}
                      và giảm tối đa đến:{" "}
                      {formatCurrency(option.max_discount_amount)}
                    </span>
                  )}
              </span>
              {(option.decreasedValue ?? 0) > 0 && option.discount_type === "percentage" && !option.disabled && (
                <span>
                  Có thể giảm: {formatCurrency(option.decreasedValue ?? 0)}
                </span>
              )}
              <span>
                Bắt đầu: {format(new Date(option.start_date), "dd/MM/yyyy")} -
                Kết thúc: {format(new Date(option.end_date), "dd/MM/yyyy")}
              </span>
              {option.disabled &&
                option.minimum_order_value &&
                orderValue !== undefined && (
                  <i style={{ color: "red" }}>
                    Đơn hàng chưa đủ điều kiện áp dụng voucher. Yêu cầu đơn hàng
                    tối thiểu: {formatCurrency(option.minimum_order_value)}
                  </i>
                )}
            </Box>
          </MenuItem>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Áp dụng Voucher" variant="outlined" />
        )}
        isOptionEqualToValue={(option, value) =>
          option.promotion_id === value.promotion_id
        }
        noOptionsText="Không có voucher"
        value={selectedPromo}
        onChange={(_, value) => {
          setSelectedPromo(value);
          onChange(value);
        }}
      />
    </Box>
  );
}
