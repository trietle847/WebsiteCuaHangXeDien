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
}

export default function Select({
  config,
  idKey,
  nameKey,
  onChange,
  value,
}: SelectManageProps) {
  const { data } = useQuery({
    queryKey: [config.name],
    queryFn: () => config.api.getAll(),
  });

  const [localValue, setLocalValue] = useState(value || null);
  const [openMange, setOpenMange] = useState(false);

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      {data ? (
        <TextField
          select
          label={config.label}
          value={localValue}
          defaultValue={""}
          onChange={(event) => {
            setLocalValue(event.target.value);
            if(onChange) onChange(event.target.value);
          }}
        >
          {data.data.map((item: any) => (
            <MenuItem key={item[idKey]} value={item[idKey]}>
              {item[nameKey]}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField disabled select>
          <MenuItem>Không tìm thấy dữ liệu</MenuItem>
        </TextField>
      )}
      <Tooltip title={`Quản lý ${config.label}`}>
        <IconButton>
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
