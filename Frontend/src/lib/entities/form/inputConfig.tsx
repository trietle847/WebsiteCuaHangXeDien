import React from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import type { RegisterOptions } from "react-hook-form";
import UploadFile from "../../../components/inputs/UploadFile";
// import UpdateFile from "../../../components/inputs/UpdateFile";
import SelectManage from "../../../components/inputs/SelectManage";
import { defineConfig } from "./formConfig";

// Dùng RegisterOptions của react-hook-form cho validation
export type ValidationRules = RegisterOptions;

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

// Upload file
export const uploadFile = (
  maxFiles?: number,
  validation?: ValidationRules
): InputConfig => ({
  name: "uploadFile",
  type: "file",
  defaultValue: [],
  validation,
  Component: (props) => (
    <UploadFile
      maxFiles={maxFiles}
      acceptedFileTypes={["image/*"]}
      {...props}
    />
  ),
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

export const color = () => {
  return {
    name: "color",
    initValue: "#000000",
    Component: ({ label, ...restProps }: InputComponentProps) => {
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
