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
  Divider,
  Typography,
  Badge,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material"
import HomeIcon from "@mui/icons-material/Home";
import MopedIcon from "@mui/icons-material/Moped";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
// import cartApi from "../services/cart.api";

export default function Header() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { userInfo, logout } = useAuth();
  const { cart } = useCart();

  const navLinks = [
    { title: "Trang chủ", path: "/", icon: <HomeIcon /> },
    { title: "Sản phẩm", path: "/products", icon: <MopedIcon /> },
    { title: "Dịch vụ", path: "/services", icon: <SupportAgentIcon /> },
    { title: "Quản lý", path: "/dashboard", icon: <ManageAccountsIcon />, forStaff: true },
  ];

  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  // Ẩn header ở các trang đặc biệt
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.includes("/dashboard")
  ) {
    return null;
  }

  return (
    <Box component="header">
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          bgcolor: "white",
          color: "black",
          px: { xs: 1, sm: 4 },
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "70px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              sx={{
                display: {
                  xs: "block",
                  lg: "none",
                },
              }}
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon sx={{ color: "#1976d2" }} />
            </IconButton>

            <Link
              component={RouterLink}
              to="/"
              underline="none"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <img src="/emotor.png" alt="Logo" width={55} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  display: { xs: "none", sm: "block" },
                }}
              ></Typography>
            </Link>
          </Box>

          {/* Navigation links */}
          <Box
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },
              gap: 3,
            }}
          >
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              const sx = {
                fontSize: 24,
                fontWeight: active ? "700" : "500",
                color: active ? "#1976d2" : "black",
                borderBottom: active
                  ? "3px solid #1976d2"
                  : "3px solid transparent",
                transition: "0.3s",
                "&:hover": {
                  color: "#1976d2",
                  borderBottom: "3px solid #1976d2",
                },
                display: link.forStaff === undefined || (link.forStaff && userInfo && userInfo.role !== "user") ? "block" : "none",
              };
              
              return (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  // sx={{
                  //   fontSize: 24,
                  //   fontWeight: active ? "700" : "500",
                  //   color: active ? "#1976d2" : "black",
                  //   borderBottom: active
                  //     ? "3px solid #1976d2"
                  //     : "3px solid transparent",
                  //   transition: "0.3s",
                  //   "&:hover": {
                  //     color: "#1976d2",
                  //     borderBottom: "3px solid #1976d2",
                  //   },
                  // }}
                  sx={sx}
                >
                  {link.title}
                </Link>
              );
            })}
          </Box>

          {/* Search + Account */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SearchBar onSearch={(q) => console.log("Searching:", q)} />
            {userInfo && userInfo.role === "user" && (
              <IconButton
                component={RouterLink}
                to="/cart"
                sx={{
                  color: "#1976d2",
                  position: "relative",
                  mx: 1,
                }}
              >
                <Badge
                  badgeContent={cart?.Items.length || 0}
                  color="error"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.7rem",
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}

            {userInfo ? (
              <>
                {isMobile ? (
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <AccountCircle sx={{ color: "#1976d2" }} />
                  </IconButton>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                      borderColor: "#1976d2",
                      color: "#f7f7f7ff",
                      fontWeight: "600",
                      textTransform: "none",
                    }}
                  >
                    {userInfo.last_name} {userInfo.first_name}
                  </Button>
                )}

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: { mt: 1, borderRadius: 2, minWidth: 160 },
                  }}
                >
                  <MenuItem component={RouterLink} to="/profile">
                    Hồ sơ cá nhân
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      logout();
                      setAnchorEl(null);
                    }}
                    sx={{ color: "error.main" }}
                  >
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  bgcolor: "#1976d2",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                {!isMobile && "Đăng nhập"}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />


        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          PaperProps={{ sx: { width: 250 } }}
          sx={{
            display: {
              lg: "none"
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
            >
              eMotor Menu
            </Typography>
            <Divider />
          </Box>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setOpenDrawer(false)}
                  sx={{
                    display: link.forStaff === undefined || (link.forStaff && userInfo && userInfo.role !== "user") ? "flex" : "none",
                    color:
                      location.pathname === link.path ? "#1976d2" : "inherit",
                    "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "#1976d2" }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

    </Box>
  );
}
