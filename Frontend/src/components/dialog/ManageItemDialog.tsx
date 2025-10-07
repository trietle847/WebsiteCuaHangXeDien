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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import AddItemDialog from "./AddItemDialog";
import UpdateItemDialog from "./UpdateItemDialog";
import { defineConfig } from "../form/formConfig";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface ManageItemDialog {
  open: boolean;
  handleClose: () => void;
  config: ReturnType<typeof defineConfig>;
  data: any
  idName: string
}

export default function ManageItemDialog({
  open,
  handleClose,
  config,
  data,
  idName
}: ManageItemDialog) {
  const [openAdd,setOpenAdd] = useState(false);
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

  const handleUpdateDialog = (item:any) => {
    setOpenUpdate(true);
    setSelectedItem(item);
  };

  const handleDelete = async (item:any) => {
    try {
      deleteMutation.mutate(item);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            minWidth: 350, // Đảm bảo tối thiểu 350px
            maxWidth: "fit-content", // Rộng vừa đủ nội dung
            borderRadius: 2, // Bo góc đẹp
            p: 1, // Padding trong dialog
          },
        },
      }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle className="flex items-center justify-between">
        <Typography>Quản lý {config.label}</Typography>
        <Tooltip title="Thêm mới">
          <Add/>
        </Tooltip>
        <AddItemDialog
            open={openAdd}
            handleClose={()=> setOpenAdd(false)}
            config={config}
            api={config.api}
        ></AddItemDialog>
      </DialogTitle>
      <DialogContent sx={{ maxHeight: 300 }}>
        <List sx={{ bgcolor: "background.paper" }}>
          {data?.map((item:any) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <div>
                  <Tooltip title="Cập nhật">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleUpdateDialog(item)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(item)}
                    >
                      <Delete/>
                    </IconButton>
                  </Tooltip>
                </div>
              }
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
        <UpdateItemDialog
          open={openUpdate}
          handleClose={()=> setOpenUpdate(false)}
          config={config}
          api={config.api}
          idName={idName}
          data={selectedItem}
        ></UpdateItemDialog>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
