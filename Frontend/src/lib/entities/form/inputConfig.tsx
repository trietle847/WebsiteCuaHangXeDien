import React from "react";
import { Box, Input, Typography, TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import type { RegisterOptions } from "react-hook-form";
import UploadFile from "../../../components/inputs/UploadFile";
import UpdateFile from "../../../components/inputs/UpdateFile";
import SelectManage from "../../../components/inputs/SelectManage";
import { defineConfig } from "./formConfig";


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
  type?: string;
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

  number: (
    min?: number | undefined,
    max?: number | undefined,
    type: "integer" | "float" = "integer"
  ): ValidationRules => {
    let rules: ValidationRules = {};
    if (type === "integer")
      rules = {
        pattern: {
          value: /^\d+$/,
          message: "Chỉ được nhập số nguyên",
        },
      };
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
  sx?: TextFieldProps["sx"]
): InputConfig => {
  // ← Thêm return type
  return {
    name: "text",
    type: type, // ← Thêm field type
    initValue: "",
    render: ({
      name,
      label,
      error,
      helperText,
      required,
      min,
      max,
      ...restProps
    }: InputProps) => {
      return (
        <TextField
          type={type}
          name={restProps.propname}
          label={label}
          error={error}
          helperText={helperText}
          sx={{ width: "100%", ...sx }}
          required={required}
          slotProps={{
            htmlInput: {
              min: min?.value,
              max: max?.value,
            },
          }}
          {...restProps}
        />
      );
    },
  };
};

export const uploadFile = (
  compact?: boolean,
  columns?: number,
  previewHeight?: number,
  maxFiles?: number
): InputConfig => {
  return {
    name: "uploadFile",
    initValue: [], // Array của files
    render: ({
      name,
      label,
      error,
      helperText,
      required,
      onChange,
      value,
      ...restProps
    }: InputProps) => {
      return (
        <UploadFile
          label={label}
          onChange={onChange}
          compact={compact}
          columns={columns}
          previewHeight={previewHeight}
          required={required}
          error={error}
          helperText={helperText}
          maxFiles={maxFiles}
          {...restProps}
        />
      );
    },
  };
};

export const updateFile = (
  fileType: "image" | "video",
  maxFiles: number,
  urlName: string,
  idName: string,
  onAddKey: string,
  onDeleteKey: string
): InputConfig => {
  return {
    name: "updateFile",
    initValue: [], // Array của files
    render: ({ control, label, onChange, value, ...restProps }: InputProps) => {
      return (
        <UpdateFile
          fileType={fileType}
          label={label || ""}
          maxFiles={maxFiles}
          items={value || []}
          urlName={urlName}
          idName={idName}
          onAddKey={onAddKey}
          onDeleteKey={onDeleteKey}
          control={control}
          {...restProps}
        />
      );
    },
  };
};

export const selectManage = (
  config: ReturnType<typeof defineConfig>,
  nameKey: string
): InputConfig => {
  return {
    name: "manageSelect",
    initValue: "",
    render: ({ name, label, ...restProps }: InputProps) => {
      return (
        <SelectManage
          config={config}
          idKey={name!}
          nameKey={nameKey}
          {...restProps}
        ></SelectManage>
      );
    },
  };
};

export const color = () => {
  return {
    name: "color",
    initValue: "#000000",
    render: ({ name, label, ...restProps }: InputProps) => {
      return (
        <Box>
          <Typography variant="body1">{label}</Typography>
          <input
            type="color"
            style={{
              width: 200,
              height: 100
            }}
            name={name}
            value={restProps.value}
            onChange={restProps.onChange}
          />
        </Box>
      );
    },
  };
}