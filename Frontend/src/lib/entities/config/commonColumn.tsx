import type { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { IconButton, Tooltip, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface ActionColumnProps {
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  permission: {
    update?: boolean;
    delete?: boolean;
  };
}

export function actionColumn({ onEdit, onDelete, permission }: ActionColumnProps): GridColDef {
  return {
    field: "actions",
    headerName: "Hành động",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        {permission.update && onEdit && (
          <Tooltip title="Chỉnh sửa">
            <IconButton sx={{
              "&:hover": { color: "blue" }
            }} onClick={() => onEdit(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
        )}
        {permission.delete && onDelete && (
          <Tooltip title="Xóa">
            <IconButton sx={{
              "&:hover": {color: "red"}
            }} onClick={() => onDelete(params.row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
  };
}
