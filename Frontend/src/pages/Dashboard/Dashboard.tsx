import {
  Box,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Home,
  Menu,
  Inventory,
  AssignmentTurnedIn,
  Person,
  Assessment,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";

const navLinks = [
  { title: "Sản phẩm", path: "/dashboard/products", icon: <Inventory /> },
  {
    title: "Đơn hàng",
    path: "/dashboard/orders",
    icon: <AssignmentTurnedIn />,
  },
  { title: "Khách hàng", path: "/dashboard/customers", icon: <Person /> },
  { title: "Báo cáo", path: "/dashboard/reports", icon: <Assessment /> },
];

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const SidebarContent = () => {
    const [open, setOpen] = useState(isMobile ? true : false);
    const location = useLocation();
    const currentPath = location.pathname;

    return (
      <Box
        className="bg-gradient-to-b from-blue-900 to-blue-800 text-white"
        sx={{
          width: open ? 250 : 70,
          height: "100vh",
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
        role="presentation"
      >
        <IconButton
          sx={{ display: { xs: "none", md: "block" }, color: "inherit", mx: 2 }}
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </IconButton>
        <List
          disablePadding
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            mt: 2,
          }}
        >
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <ListItem
                key={link.title}
                disablePadding
                component={Link}
                to={link.path}
                sx={{ color: "inherit", textDecoration: "none" }}
              >
                <ListItemButton
                  sx={{
                    width: "100%",
                    minHeight: 48,
                    justifyContent: "flex-start",
                    bgcolor: isActive
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: isActive
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <Tooltip title={open ? "" : link.title} placement="right">
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 40,
                        mr: open ? 2 : 0,
                        justifyContent: "center",
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                  </Tooltip>

                  <Box
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: "opacity 0.2s ease",
                      transitionDelay: open ? "0.1s" : "0s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {open && <ListItemText primary={link.title} />}
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };
  return (
    <Box sx={{ display: "flex", width: "100vw" }}>
      {/* Desktop sidebar */}
      {!isMobile && <SidebarContent />}
      {/* Main content area */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Header */}
        <Box className="flex items-center justify-between px-4 h-16 border-b border-gray">
          <Box className="flex items-center gap-4">
            {isMobile && (
              <IconButton
                onClick={() => setOpenDrawer(true)}
                edge="end"
                color="primary"
                aria-label="menu"
              >
                <Menu />
              </IconButton>
            )}
            <Typography variant="h5">Dashboard</Typography>
          </Box>
          <Tooltip title="Về trang chủ">
            <IconButton
              sx={{ mr: 2 }}
              color="primary"
              aria-label="menu"
              onClick={() => navigate("/")}
            >
              <Home />
            </IconButton>
          </Tooltip>
        </Box>
        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
      {/* Mobile sidebar (Drawer) */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <SidebarContent />
        </Drawer>
      )}
    </Box>
  );
}
