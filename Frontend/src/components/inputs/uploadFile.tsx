import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { Box, Typography } from "@mui/material";

// Import CSS
import "filepond/dist/filepond.min.css";

// Import plugins (optional)
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

// Register plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

interface UploadFileProps {
  label?: string;
  onChange?: (files: any[]) => void;
  callValidate?: (files: any[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: string;
  compact?: boolean; // ← Mode compact
  columns?: number; // ← Số cột hiển thị (2, 3, 4...)
  previewHeight?: number; // ← Chiều cao preview tùy chỉnh
  required?: boolean;
  error?: boolean; // ← Thêm error prop
  helperText?: string; // ← Thêm helperText prop
}

export default function UploadFile({
  label,
  onChange,
  maxFiles = 5,
  acceptedFileTypes = ["image/*"],
  maxFileSize = "5MB",
  compact = false, // ← Mặc định false
  columns = 2, // ← Mặc định 2 cột
  previewHeight = 120, // ← Mặc định 120px
  required = false,
  error = false,
  helperText,
}: UploadFileProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleUpdateFiles = (fileItems: any[]) => {
    setLocalError(null); // Clear local error on file update
    if (onChange) {
      onChange(fileItems.map((fileItem) => fileItem.file));
    }
    setFiles(fileItems);
  };

  const columnWidth = `calc(${100 / columns}% - 0.5em)`;

  return (
    <Box
      sx={{
        width: "100%",
        // CSS custom cho compact mode
        ...(compact && {
          "& .filepond--item": {
            width: columnWidth, // ← Động theo số cột
          },
          "& .filepond--image-preview": {
            height: `${previewHeight}px !important`, // ← Chiều cao tùy chỉnh
          },
          "& .filepond--panel-root": {
            minHeight: `${previewHeight}px`,
          },
        }),
        // Fix lồi ra khi chưa có file
        "& .filepond--root": {
          marginBottom: 0,
        },
        "& .filepond--drop-label": {
          minHeight: files.length === 0 ? "100px" : "auto",
        },
        "& .filepond--panel-root": {
          backgroundColor: "#f9fafb",
          border: error ? "2px solid #ef4444" : "2px dashed #d1d5db",
          borderRadius: "8px",
        },
        "& .filepond--credits": {
          display: "none", // Ẩn credits
        },
      }}
    >
      {/* Label với error styling */}
      {label && (
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            color: error ? "error.main" : "text.primary",
            fontWeight: error ? 500 : 400,
          }}
        >
          {label}
          {required ? " *" : ""}
        </Typography>
      )}
      {error && helperText && (
        <Typography
          variant="caption"
          sx={{
            color: "error.main",
            display: "block",
            mt: 0.5,
            ml: 1.75,
          }}
        >
          {helperText}
        </Typography>
      )}
      {localError && (
        <Typography
          variant="caption"
          sx={{
            color: "error.main",
            display: "block",
            mt: 0.5,
            ml: 1.75,
          }}
        >
          {localError}
        </Typography>
      )}

      {/* FilePond component */}
      <FilePond
        files={files}
        onupdatefiles={handleUpdateFiles}
        onwarning={(error) => {
          if (error.body === "Max files" && files.length < maxFiles) {
            setLocalError("Chỉ được upload tối đa " + maxFiles + " file");
          }
        }}
        allowMultiple={maxFiles > 1}
        maxFiles={maxFiles}
        acceptedFileTypes={acceptedFileTypes}
        maxFileSize={maxFileSize}
        imagePreviewHeight={compact ? previewHeight : 170}
        labelIdle='Kéo thả ảnh vào đây hoặc <span class="filepond--label-action">Chọn file</span>'
        labelFileTypeNotAllowed="Loại file không hợp lệ"
        fileValidateTypeLabelExpectedTypes="Chỉ chấp nhận {allTypes}"
        labelMaxFileSizeExceeded="File quá lớn"
        labelMaxFileSize={`Kích thước tối đa ${maxFileSize}`}
        labelMaxTotalFileSizeExceeded="Tổng kích thước file quá lớn"
        labelMaxTotalFileSize={`Tổng kích thước tối đa: ${maxFileSize}`}
      />
    </Box>
  );
}
