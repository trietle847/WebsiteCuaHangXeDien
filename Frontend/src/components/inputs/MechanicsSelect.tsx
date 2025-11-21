import { Box, MenuItem, TextField } from "@mui/material";
import staffApi from "../../services/staff.api";
import { useQuery } from "@tanstack/react-query";
import type { Mechanic } from "../../lib/types";

function getStatusContent(queueLength: number): {
  text: string;
  color: "green" | "orange" | "red";
} {
  if (queueLength === 0)
    return {
      text: "rảnh",
      color: "green",
    };
  if (queueLength <= 2)
    return {
      text: "bận",
      color: "orange",
    };
  return {
    text: "rất bận",
    color: "red",
  };
}

export default function MechanicsSelect({
  value,
  required,
  onChange,
  error,
  helperText,
}: {
  value?: string | null;
  required?: boolean;
  onChange: (mechanic: string | null) => void;
  error?: boolean;
  helperText?: string;
}) {
  const { data } = useQuery({
    queryKey: ["mechanics"],
    queryFn: async () => {
      return await staffApi.getMechanics();
    },
  });

  const mechanics = data?.data;

  return (
    <TextField
      select
      label="Chọn kỹ thuật viên"
      fullWidth
      required={required}
      value={value || ""}
      error={error}
      helperText={helperText}
      slotProps={{
        select: {
          renderValue: (selected) => {
            if (!selected) return <em>Để trống</em>;
            const mechanic = mechanics?.find(
              (m: Mechanic) => m.user_id === selected
            );
            return mechanic ? mechanic.full_name : "";
          },
        },
      }}
      onChange={(e) => {
        onChange(e.target.value || null);
      }}
    >
      <MenuItem value={""}>
        <em>Để trống</em>
      </MenuItem>
      {mechanics && mechanics.length > 0 ? (
        mechanics.map((mechanic: Mechanic) => {
          const content = getStatusContent(mechanic.ticketQueue);
          return (
            <MenuItem key={mechanic.user_id} value={mechanic.user_id}>
              <Box>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: content.color,
                    borderRadius: "50%",
                    display: "inline-block",
                    mr: 1,
                  }}
                ></Box>{" "}
                {mechanic.full_name} - {content.text}{" "}
                {mechanic.ticketQueue > 0 ? `(${mechanic.ticketQueue} xe)` : ""}
              </Box>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem disabled>Không có thợ sửa chữa</MenuItem>
      )}
    </TextField>
  );
}
