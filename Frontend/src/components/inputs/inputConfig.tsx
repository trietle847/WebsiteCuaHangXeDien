import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

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
  render: (props: InputProps) => React.JSX.Element;
}

export const text = (type: string = "text", sx: TextFieldProps = {}) => {
  return {
    name: "text",
    initValue: "",
    render: ({ name, label, error, helperText, ...restProps }: InputProps) => {
      return (
        <TextField
          type={type}
          name={restProps.propname}
          label={label}
          error={!!error}
          helperText={helperText}
          sx={{ width: "100%", ...sx }}
          {...restProps}
        />
      );
    },
  };
};
