import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import type { RegisterOptions } from "react-hook-form";

// Dùng RegisterOptions của react-hook-form cho validation
export type ValidationRules = RegisterOptions;

// Định nghĩa kiểu cho props của input
export interface InputProps {
  value?: any;
  onChange?: (value: any, propname?: string) => void;
  name?: string;
  propname?: string;
  error?: boolean;
  helperText?: string;
  [key: string]: any; // Cho phép truyền thêm các props khác
}

export interface InputConfig {
  name: string;
  initValue: any;
  type: string;
  required?: boolean;
  validation?: ValidationRules; // Thêm validation
  render: (props: InputProps) => React.JSX.Element;
}

// Helper validation cho text input
export const textValidation = {
  name: (min = 3, max = 100): ValidationRules => ({
    minLength: { value: min, message: `Tối thiểu ${min} ký tự` },
    maxLength: { value: max, message: `Tối đa ${max} ký tự` },
  }),

  email: (): ValidationRules => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email không hợp lệ",
    },
  }),

  phone: (): ValidationRules => ({
    pattern: {
      value: /^[0-9]{10,11}$/,
      message: "Số điện thoại phải có 10-11 chữ số",
    },
  }),

  number: (min?: number, max?: number): ValidationRules => {
    const rules: ValidationRules = {};
    if (min !== undefined) {
      rules.min = { value: min, message: `Giá trị tối thiểu là ${min}` };
    }
    if (max !== undefined) {
      rules.max = { value: max, message: `Giá trị tối đa là ${max}` };
    }
    return rules;
  },

  length: (min?: number, max?: number): ValidationRules => {
    const rules: ValidationRules = {};
    if (min !== undefined) {
      rules.minLength = { value: min, message: `Tối thiểu ${min} ký tự` };
    }
    if (max !== undefined) {
      rules.maxLength = { value: max, message: `Tối đa ${max} ký tự` };
    }
    return rules;
  },
};

export const text = (
  type: string = "text",
  sx?: TextFieldProps["sx"],
  validation?: ValidationRules
) => {
  return {
    name: "text",
    initValue: "",
    validation, // Thêm validation vào config
    render: ({ name, label, error, helperText,min,max,minLength,maxLength, required, ...restProps }: InputProps) => {
      return (
        <TextField
          type={type}
          name={restProps.propname}
          label={`${label}${required ? " *" : ""}`}
          error={!!error}
          helperText={helperText}
          sx={{ width: "100%", ...sx }}
          slotProps={{
            htmlInput: {
              min: min ? min.value : undefined,
              max: max ? max.value : undefined,
              minLength: minLength ? minLength.value : undefined,
              maxLength: maxLength ? maxLength.value : undefined,
            },
          }}
          {...restProps}
        />
      );
    },
  };
};
