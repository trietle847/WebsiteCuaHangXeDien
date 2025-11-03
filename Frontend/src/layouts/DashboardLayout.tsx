// DashboardLayout.tsx

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
  Engineering,
  Assessment,
} from "@mui/icons-material";
import { useState, memo, useMemo } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";

const navLinks = [
  { title: "Sản phẩm", path: "/dashboard/products", icon: <Inventory /> },
  { title: "Khách hàng", path: "/dashboard/users", icon: <Person /> },
  { title: "Nhân viên", path: "/dashboard/staffs", icon: <Engineering /> },
  {
    title: "Đơn hàng",
    path: "/dashboard/orders",
    icon: <AssignmentTurnedIn />,
  },
  { title: "Báo cáo", path: "/dashboard/reports", icon: <Assessment /> },
];

const SidebarContent = memo(function SidebarContent({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  const containerSx = useMemo(
    () => ({
      width: open ? 250 : 70,
      height: "100vh",
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
      flexShrink: 0,
      position: "relative" as const,
    }),
    [open]
  );

  return (
    <Box
      className="bg-gradient-to-b from-blue-900 to-blue-800 text-white"
      sx={containerSx}
      role="presentation"
    >
      <IconButton
        sx={{
          display: { xs: "none", md: "block" },
          color: "inherit",
          mx: 2,
          my: 1,
        }}
        onClick={onToggle} // Sử dụng hàm onToggle từ props
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
          const isActive = currentPath.startsWith(link.path);

          const buttonSx = {
            width: "100%",
            minHeight: 48,
            justifyContent: "flex-start",
            bgcolor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
            "&:hover": {
              bgcolor: isActive
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
            },
          };

          const textSx = {
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s ease",
            transitionDelay: open ? "0.1s" : "0s",
            whiteSpace: "nowrap" as const,
            overflow: "hidden",
          };

          return (
            <ListItem
              key={link.path}
              disablePadding
              component={Link}
              to={link.path}
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              <ListItemButton sx={buttonSx}>
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
                <Box sx={textSx}>
                  {open && (
                    <ListItemText
                      primary={link.title}
                      sx={{
                        opacity: 1,
                        animation: "fadeIn 0.2s ease-in",
                        "@keyframes fadeIn": {
                          from: { opacity: 0 },
                          to: { opacity: 1 },
                        },
                      }}
                    />
                  )}
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
});

const MainContent = memo(function MainContent({
  isMobile,
  handleDrawerToggle,
  navigate,
}: {
  isMobile: boolean;
  handleDrawerToggle: () => void;
  navigate: (path: string) => void;
}) {
  return (
    <Box
      sx={{
        flexGrow: 1, // Để nội dung co giãn chiếm phần còn lại
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto", // Cho phép cuộn nội dung chính
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              edge="start"
              color="primary"
              aria-label="menu"
            >
              <Menu />
            </IconButton>
          )}
          <Typography variant="h4">Dashboard</Typography>
        </Box>
        <Tooltip title="Về trang chủ">
          <IconButton color="primary" onClick={() => navigate("/")}>
            <Home />
          </IconButton>
        </Tooltip>
      </Box>
      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
});

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // 2. Di chuyển state quản lý sidebar ra component cha (DashboardLayout)
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Mặc định MỞ trên desktop
  const [isDrawerOpen, setDrawerOpen] = useState(false); // State riêng cho mobile drawer

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", width: "100vw" }}>
      {/* Sidebar cho Desktop */}
      {!isMobile && (
        <SidebarContent open={isSidebarOpen} onToggle={handleSidebarToggle} />
      )}

      {/* Main content area */}
      <MainContent
        isMobile={isMobile}
        handleDrawerToggle={handleDrawerToggle}
        navigate={navigate}
      />

      {/* Drawer cho Mobile */}
      {isMobile && (
        <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
          {/* Mobile không cần nút toggle bên trong nên ta chỉ cần truyền state */}
          <SidebarContent open={true} onToggle={handleDrawerToggle} />
        </Drawer>
      )}
    </Box>
  );
}
