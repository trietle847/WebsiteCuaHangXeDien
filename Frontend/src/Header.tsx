import {
  AppBar,
  Box,
  Link,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MopedIcon from "@mui/icons-material/Moped";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import SearchBar from "./components/SearchBar";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navLinks = [
    { title: "Trang chủ", path: "/", icon: <HomeIcon /> },
    { title: "Sản phẩm", path: "/products", icon: <MopedIcon /> },
    { title: "Dịch vụ", path: "/services", icon: <SupportAgentIcon /> },
    { title: "Quản lý", path: "/dashboard", icon: <ManageAccountsIcon /> },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Box component={"header"}>
      <AppBar position="fixed" sx={{ bgcolor: "white", color: "black" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={() => setOpenDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Link href="/" underline="none">
              <img src="/emotor.png" alt="Logo" width={60} />
            </Link>
          </Box>
          {!isMobile && (
            <Box
              component="nav"
              sx={{
                display: { xs: "none", md: "flex", alignItems: "center" },
                gap: { md: 1, lg: 2 },
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  className={
                    location.pathname === link.path ? "activeLink" : ""
                  }
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SearchBar
              onSearch={(query) => console.log("Searching for:", query)}
            />
            <Button
              size="medium"
              variant="contained"
              sx={{ display: "flex", gap: 1 }}
              href="/login"
            >
              {!isMobile && <span>Đăng nhập</span>}
              <LoginIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Box sx={{ width: 250 }} role="presentation">
            <List component={"nav"} className="mobileNav">
              {navLinks.map((link) => (
                <ListItem
                  component={RouterLink}
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpenDrawer(false)}
                  className={
                    location.pathname === link.path ? "activeLink" : ""
                  }
                >
                  <ListItemButton className="mobileButton">
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
      <Toolbar />
    </Box>
  );
}
