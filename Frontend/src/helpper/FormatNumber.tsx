function FormatNumber(x: number) {
  if (isNaN(x)) {
    return 0;
  }

  return x.toLocaleString("vi-VN");
}

export default FormatNumber;

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};
