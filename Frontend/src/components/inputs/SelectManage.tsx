import { TextField, MenuItem, Box, Tooltip, IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import ManageItemDialog from "../dialog/ManageItemDialog";
import { defineConfig } from "../../lib/entities/form/formConfig";
import { useQuery } from "@tanstack/react-query";
import { useState, memo, useCallback, useMemo } from "react";

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

const SelectManage = memo(
  function SelectManage({
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
    const safeValue =
      value !== undefined && value !== null ? String(value) : "";

    // Memoize onChange handler
    const handleChange = useCallback(
      (event: any) => {
        const newValue = event.target.value;
        if (onChange) onChange(newValue);
      },
      [onChange]
    );

    const handleOpenDialog = useCallback(() => setOpenMange(true), []);
    const handleCloseDialog = useCallback(() => setOpenMange(false), []);

    // Memoize menu items để tránh re-render khi typing
    const menuItems = useMemo(() => {
      if (!data?.data) return null;
      return data.data.map((item: any) => (
        <MenuItem key={item[idKey]} value={String(item[idKey])}>
          {item[nameKey]}
        </MenuItem>
      ));
    }, [data?.data, idKey, nameKey]);

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
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <TextField
          select
          fullWidth
          label={label || config.label}
          value={safeValue}
          onChange={handleChange}
          error={error}
          helperText={helperText}
          required={required}
        >
          {/* Luôn có option trống */}
          <MenuItem value="">
            <em>-- Chọn {config.label.toLowerCase()} --</em>
          </MenuItem>
          {menuItems}
        </TextField>
        <Tooltip title={`Quản lý ${config.label}`}>
          <IconButton onClick={handleOpenDialog} sx={{ mt: 1 }}>
            <Settings />
          </IconButton>
        </Tooltip>
        {/* Chỉ render dialog khi mở */}
        {openMange && (
          <ManageItemDialog
            open={openMange}
            handleClose={handleCloseDialog}
            config={config}
            data={data?.data}
            idName={idKey}
          />
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: chỉ re-render khi value hoặc data thay đổi
    return (
      prevProps.value === nextProps.value &&
      prevProps.error === nextProps.error &&
      prevProps.helperText === nextProps.helperText &&
      prevProps.config.name === nextProps.config.name
    );
  }
);

export default SelectManage;
