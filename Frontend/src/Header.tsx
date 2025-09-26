import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box>
      <AppBar position="fixed" sx={{ bgcolor: "white", color: "black" }}>
        <Toolbar>
          <Typography>Header</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
