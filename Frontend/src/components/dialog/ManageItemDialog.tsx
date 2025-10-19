import {
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Add, Delete, Edit, Settings } from "@mui/icons-material";
import AddItemDialog from "./AddItemDialog";
import UpdateItemDialog from "./UpdateItemDialog";
import { defineConfig } from "../../lib/entities/form/formConfig";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface ManageItemDialog {
  open: boolean;
  handleClose: () => void;
  config: ReturnType<typeof defineConfig>;
  data: any;
  idName: string;
  permission?:{
    create?: boolean;
    update?: boolean;
    delete?: boolean;
  }
  isColor?: boolean;
}

export default function ManageItemDialog({
  open,
  handleClose,
  config,
  data,
  idName,
  permission = { create: true, update: true, delete: true },
  isColor,
}: ManageItemDialog) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: any) => {
      if (!confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
        return Promise.reject("User cancelled deletion");
      }
      return config.api.delete(id);
    },
    onSuccess: () => {
      console.log("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: [config.name] });
    },
  });

  const handleUpdateDialog = (item: any) => {
    setOpenUpdate(true);
    setSelectedItem(item);
  };

  const handleDelete = async (item: any) => {
    try {
      deleteMutation.mutate(item);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      scroll="paper"
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            minHeight: "60vh",
            maxHeight: "80vh",
            background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
            boxShadow: 24,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "primary.main",
          color: "white",
          py: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Settings sx={{ fontSize: 28 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Quản lý {config.label.toLowerCase()}
          </Typography>
        </Box>
        {permission.create && (
        <Tooltip title="Thêm mới">
          <IconButton
            onClick={() => setOpenAdd(true)}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>)}
        <AddItemDialog
          open={openAdd}
          handleClose={() => setOpenAdd(false)}
          config={config}
          api={config.api}
          width="sm"
        />
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2, bgcolor: "#fafafa" }}>
        {data && data.length > 0 ? (
          <List
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              "& .MuiListItem-root": {
                borderBottom: "1px solid #f0f0f0",
                py: 2,
                "&:last-child": {
                  borderBottom: "none",
                },
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transition: "background-color 0.2s",
                },
              },
            }}
          >
            {data.map((item: any) => (
              <ListItem
                key={item[idName]}
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {permission.update && (
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleUpdateDialog(item)}
                        color="primary"
                        sx={{
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "white",
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>)}
                    {permission.delete && (
                    <Tooltip title="Xóa">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(item[idName])}
                        color="error"
                        sx={{
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "white",
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>)}
                  </Box>
                }
              >
                {isColor && (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: item.code,
                      border: "1px solid #000",
                      mr: 2,
                      borderRadius: "25px",
                    }}
                  />
                )}
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              gap: 2,
            }}
          >
            <Settings sx={{ fontSize: 64, color: "text.disabled" }} />
            <Typography variant="body1" color="text.secondary">
              Chưa có dữ liệu
            </Typography>
          </Box>
        )}
        <UpdateItemDialog
          open={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          config={config}
          api={config.api}
          idName={idName}
          data={selectedItem}
          width="sm"
        />
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fafafa",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{
            minWidth: 100,
            bgcolor: "gray",
            "&:hover": { bgcolor: "darkgray" },
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
