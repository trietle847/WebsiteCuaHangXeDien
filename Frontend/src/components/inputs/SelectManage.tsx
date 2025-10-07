import { TextField, MenuItem, Box, Tooltip, IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import ManageItemDialog from "../dialog/ManageItemDialog";
import { defineConfig } from "../form/formConfig";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface SelectManageProps {
  config: ReturnType<typeof defineConfig>;
  idKey: string;
  nameKey: string;
  onChange?: (e: any) => void;
  value?: any;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export default function Select({
  config,
  idKey,
  nameKey,
  onChange,
  value,
  label,
  error = false,
  helperText,
  required = false,
}: SelectManageProps) {
  const { data, isLoading } = useQuery({
    queryKey: [config.name],
    queryFn: () => config.api.getAll(),
  });

  const [openMange, setOpenMange] = useState(false);

  // Đảm bảo value luôn là string hợp lệ
  const safeValue = value !== undefined && value !== null ? String(value) : "";

  // Nếu đang loading, hiển thị loading state
  if (isLoading || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <TextField
          disabled
          select
          fullWidth
          label={label || config.label}
          value=""
        >
          <MenuItem value="">Đang tải...</MenuItem>
        </TextField>
        <Tooltip title={`Quản lý ${config.label}`}>
          <IconButton sx={{ mt: 1 }}>
            <Settings />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", gap: 1, alignItems: "flex-start", width: "100%" }}
    >
      <TextField
        select
        fullWidth
        label={label || config.label}
        value={safeValue}
        onChange={(event) => {
          const newValue = event.target.value;
          if (onChange) onChange(newValue);
        }}
        error={error}
        helperText={helperText}
        required={required}
      >
        {/* Luôn có option trống */}
        <MenuItem value="">
          <em>-- Chọn {config.label.toLowerCase()} --</em>
        </MenuItem>
        {data.data.map((item: any) => (
          <MenuItem key={item[idKey]} value={String(item[idKey])}>
            {item[nameKey]}
          </MenuItem>
        ))}
      </TextField>
      <Tooltip title={`Quản lý ${config.label}`}>
        <IconButton onClick={() => setOpenMange(true)} sx={{ mt: 1 }}>
          <Settings />
        </IconButton>
      </Tooltip>
      <ManageItemDialog
        open={openMange}
        handleClose={() => setOpenMange(false)}
        config={config}
        data={data?.data}
        idName={idKey}
      />
    </Box>
  );
}
