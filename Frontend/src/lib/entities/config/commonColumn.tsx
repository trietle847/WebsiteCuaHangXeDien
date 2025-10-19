import type { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { IconButton, Tooltip, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface ActionColumnProps {
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  permission: {
    update?: boolean;
    delete?: boolean;
  };
}

export function actionColumn({ onEdit, onDelete, permission }: ActionColumnProps): GridColDef {
  return {
    field: "actions",
    headerName: "Hành động",
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        {permission.update && (
          <Tooltip title="Chỉnh sửa">
            <IconButton onClick={() => onEdit(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
        )}
        {permission.delete && (
          <Tooltip title="Xóa">
            <IconButton onClick={() => onDelete(params.row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
  };
}
