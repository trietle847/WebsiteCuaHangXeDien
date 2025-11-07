import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useWatch } from "react-hook-form";

interface DynamicDiscountInputProps {
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  name?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  control: any; // Control từ React Hook Form
}

export default function DynamicDiscountInput({
  value,
  onChange,
  control,
  label,
  error,
  helperText,
  required,
  disabled,
  ...restProps
}: DynamicDiscountInputProps) {
  // Watch discount_type để thay đổi input type
  const discountType = useWatch({
    control,
    name: "discount_type",
    defaultValue: "percentage",
  });

  const isPercentage = discountType === "percentage";

  return (
    <NumericFormat
      {...restProps}
      customInput={TextField}
      label={isPercentage ? "Tỷ lệ giảm giá (%)" : "Số tiền giảm (đ)"}
      thousandSeparator="."
      decimalSeparator=","
      suffix={isPercentage ? " %" : " đ"}
      value={value || ""}
      max={isPercentage?100:undefined}
      allowNegative={false}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      onValueChange={(values) => {
        if (onChange) {
          onChange(values.floatValue ?? "");
        }
      }}
    />
  );
}
