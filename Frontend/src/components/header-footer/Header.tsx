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
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import MopedIcon from "@mui/icons-material/Moped";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import SearchBar from "../SearchBar";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navLinks = [
    { title: "Trang chủ", path: "/", icon: <HomeIcon /> },
    { title: "Sản phẩm", path: "/products", icon: <MopedIcon /> },
    { title: "Dịch vụ", path: "/services", icon: <SupportAgentIcon /> },
    { title: "Quản lý", path: "/dashboard", icon: <ManageAccountsIcon /> },
  ];

  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  if(location.pathname === "/login" || location.pathname.includes("/dashboard")) {
    return null; // Không hiển thị Header trên trang đăng nhập
  }
  const { userInfo, logout } = useAuth();

  return (
    <Box component="header">
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
              <IconButton edge="start" onClick={() => setOpenDrawer(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Link component={RouterLink} to="/" underline="none">
              <img src="/emotor.png" alt="Logo" width={60} />
            </Link>
          </Box>

          {!isMobile && (
            <Box component="nav" sx={{ display: "flex", gap: 2 }}>
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
            <SearchBar onSearch={(query) => console.log("Searching:", query)} />

            {userInfo ? (
              <>
                <Button
                  variant="outlined"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  {userInfo.last_name} {userInfo.first_name}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={logout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                size="medium"
                variant="contained"
                component={RouterLink}
                to="/login"
                sx={{ display: "flex", gap: 1 }}
              >
                {!isMobile && <span>Đăng nhập</span>}
                <LoginIcon />
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* để tránh che nội dung */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Box sx={{ width: 250 }}>
            <List className="mobileNav">
              {navLinks.map((link) => (
                <ListItem
                  className={
                    location.pathname === link.path ? "activeLink" : ""
                  }
                  key={link.path}
                  onClick={() => setOpenDrawer(false)}
                >
                  <ListItemButton className="mobileButton" component={RouterLink} to={link.path}>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
