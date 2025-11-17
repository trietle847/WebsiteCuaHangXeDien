import React from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PolicyInput from "../../../components/inputs/Policy";
import type { RegisterOptions } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import SelectManage from "../../../components/inputs/SelectManage";
import DynamicDiscountInput from "../../../components/inputs/DynamicDiscountInput";
import { defineConfig } from "./formConfig";
import { type Control } from "react-hook-form";

// Dùng RegisterOptions của react-hook-form cho validation
export type ValidationRules = Omit<
  RegisterOptions,
  "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled" | "deps"
>;

// Định nghĩa kiểu cho props của input
export interface InputComponentProps {
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  name?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  control: Control<any>;
  [key: string]: any;
}

export interface InputConfig {
  name: string;
  type: string;
  defaultValue: any;
  // Chỉ có base validation ở đây
  validation?: ValidationRules;
  // Render function nhận props đơn giản
  Component: React.ComponentType<InputComponentProps>;
}

// Validation helpers
export const textValidation = {
  // Name validation
  name: (min: number = 3, max: number = 100): ValidationRules => ({
    minLength: {
      value: min,
      message: `Tối thiểu ${min} ký tự`,
    },
    maxLength: {
      value: max,
      message: `Tối đa ${max} ký tự`,
    },
  }),

  // Email validation
  email: (): ValidationRules => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email không hợp lệ",
    },
  }),

  // Phone validation
  phone: (): ValidationRules => ({
    pattern: {
      value: /^[0-9]{10,11}$/,
      message: "Số điện thoại phải có 10-11 chữ số",
    },
  }),

  // Number validation with min/max
  number: (options?: {
    min?: number;
    max?: number;
    type?: "integer" | "float";
  }): ValidationRules => {
    const { min, max, type = "integer" } = options || {};
    const rules: ValidationRules = {};

    // Integer pattern
    if (type === "integer") {
      rules.pattern = {
        value: /^\d+$/,
        message: "Chỉ được nhập số nguyên",
      };
    }

    // Min validation
    if (min !== undefined) {
      rules.min = {
        value: min,
        message: `Giá trị tối thiểu là ${min}`,
      };
    }

    // Max validation
    if (max !== undefined) {
      rules.max = {
        value: max,
        message: `Giá trị tối đa là ${max}`,
      };
    }

    return rules;
  },

  // Length validation (alias for minLength/maxLength)
  length: (min?: number, max?: number): ValidationRules => {
    const rules: ValidationRules = {};

    if (min !== undefined) {
      rules.minLength = {
        value: min,
        message: `Tối thiểu ${min} ký tự`,
      };
    }

    if (max !== undefined) {
      rules.maxLength = {
        value: max,
        message: `Tối đa ${max} ký tự`,
      };
    }

    return rules;
  },

  // Currency validation (cho NumericFormat input)
  currency: (options?: { min?: number; max?: number }): ValidationRules => {
    const { min, max } = options || {};
    const rules: ValidationRules = {};

    // Min validation
    if (min !== undefined) {
      rules.min = {
        value: min,
        message: `Giá trị tối thiểu là ${min.toLocaleString("vi-VN")} đ`,
      };
    }

    // Max validation
    if (max !== undefined) {
      rules.max = {
        value: max,
        message: `Giá trị tối đa là ${max.toLocaleString("vi-VN")} đ`,
      };
    }

    return rules;
  },
};

const TextInput: React.FC<InputComponentProps> = ({
  label,
  error,
  helperText,
  required,
  type = "text",
  ...restProps
}) => {
  return (
    <TextField
      type={type}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      fullWidth
      {...restProps}
    />
  );
};

// Factory function đơn giản
export const text = (
  type: string = "text",
  validation?: ValidationRules
): InputConfig => ({
  name: "text",
  type,
  defaultValue: "",
  validation,
  Component: (props) => <TextInput {...props} type={type} />,
});

// ✅ Select with manage
export const selectManage = (
  config: ReturnType<typeof defineConfig>,
  nameKey: string,
  validation?: ValidationRules
): InputConfig => ({
  name: "manageSelect",
  type: "select",
  defaultValue: "",
  validation,
  Component: (props) => (
    <SelectManage
      config={config}
      idKey={props.name!}
      nameKey={nameKey}
      {...props}
    />
  ),
});

export const color = (): InputConfig => {
  return {
    name: "color",
    type: "color",
    defaultValue: "#000000",
    Component: ({ label, helperText, error, ...restProps }: InputComponentProps) => {
      return (
        <Box>
          <Typography variant="body1">{label}</Typography>
          <input
            type="color"
            style={{
              width: 200,
              height: 100,
            }}
            {...restProps}
          />
        </Box>
      );
    },
  };
};

export const option = (value: string, label: string) => {
  return {
    label,
    value,
  };
};

export const select = (range: ReturnType<typeof option>[]): InputConfig => {
  return {
    name: "select",
    type: "select",
    defaultValue: "",
    Component: (props: InputComponentProps) => {
      return (
        <TextField select {...props} fullWidth>
          <MenuItem disabled value="">
            Chọn một tùy chọn
          </MenuItem>
          {range ? (
            range.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No options</MenuItem>
          )}
        </TextField>
      );
    },
  };
};

export const textarea = (
  rows: number = 4,
  validation?: ValidationRules
): InputConfig => {
  return {
    name: "textarea",
    type: "textarea",
    defaultValue: "",
    validation,
    Component: (props) => <TextField {...props} multiline rows={rows} />,
  };
};

export const datePicker = (validation?: ValidationRules): InputConfig => {
  return {
    name: "datePicker",
    type: "date",
    defaultValue: null,
    validation,
    Component: (props) => {
      const value = props.value
        ? typeof props.value === "string"
          ? new Date(props.value)
          : props.value
        : null;

      const handleChange = (newValue: Date | null) => {
        if (props.onChange) {
          props.onChange(newValue ? newValue.toISOString() : null);
        }
      };

      return (
        <DatePicker
          {...props}
          value={value}
          onChange={handleChange}
          slotProps={{
            textField: {
              required: props.required,
              error: props.error,
              helperText: props.helperText,
            },
          }}
        />
      );
    },
  };
};

export const currency = (validation?: ValidationRules): InputConfig => {
  return {
    name: "currency",
    type: "text",
    defaultValue: "",
    validation,
    Component: (props) => {
      const { value, onChange, ...restProps } = props;

      return (
        <NumericFormat
          {...restProps}
          customInput={TextField}
          thousandSeparator="."
          decimalSeparator=","
          suffix=" đ"
          value={value || ""}
          allowNegative={false}
          onValueChange={(values) => {
            if (onChange) {
              // Chỉ gửi số thuần túy, không có format
              onChange(values.floatValue ?? "");
            }
          }}
        />
      );
    },
  };
};

// Dynamic discount value input (thay đổi theo discount_type)
export const dynamicDiscountValue = (
  validation?: ValidationRules
): InputConfig => {
  return {
    name: "dynamicDiscountValue",
    type: "text",
    defaultValue: "",
    validation,
    Component: (props) => (
      <DynamicDiscountInput {...props} control={props.control!} />
    ),
  };
};

export const policy = (forProduct: boolean): InputConfig => {
  return {
    name: "policy",
    type: "policy",
    defaultValue: {
      maintenance_policy: [],
      warranty_policy: [],
    },
    Component: (props) => <PolicyInput {...props} forProduct={forProduct} />,
  };
};
