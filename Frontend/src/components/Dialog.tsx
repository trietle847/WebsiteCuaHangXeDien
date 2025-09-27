import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
export default function CustomDialog() {
  return (
      <Dialog open={true}>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          <Typography>This is the content of the dialog.</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
  );
}
