import {
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  Link as MuiLink,
  Tooltip,
  Breadcrumbs,
} from "@mui/material";
import {
  Home,
  Menu,
} from "@mui/icons-material";
import { useState, memo, useMemo } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const breadcrumbLabels = {
  products: "Sản phẩm",
  promotions: "Khuyến mãi",
  users: "Người dùng",
  customers: "Khách hàng",
  staffs: "Nhân viên",
  orders: "Đơn hàng",
  services: "Dịch vụ",
  comments: "Bình luận",
  reports: "Báo cáo",
  new: "Tạo mới",
  edit: "Chỉnh sửa",
};

const Header = memo(function Header({
  isMobile,
  handleDrawerToggle,
  navigate,
}: {
  isMobile: boolean;
  handleDrawerToggle: () => void;
  navigate: (path: string) => void;
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Memoize pathSegments để không tính lại mỗi render
  const pathSegments = useMemo(
    () =>
      currentPath
        .split("/")
        .filter((segment) => !["", "dashboard"].includes(segment)),
    [currentPath]
  );

  return (
    <Box
      sx={{
        px: 3,
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

        <Breadcrumbs aria-label="breadcrumb">
          {pathSegments.map((segment, index) => {
            const last = index === pathSegments.length - 1;
            const to = `/dashboard/${pathSegments
              .slice(0, index + 1)
              .join("/")}`;
            return (
              <BreadcrumbLink
                key={to}
                segment={segment}
                to={to}
                last={last}
                pathSegments={pathSegments}
              />
            );
          })}
        </Breadcrumbs>
      </Box>
      <Tooltip title="Về trang chủ">
        <IconButton color="primary" onClick={() => navigate("/")}>
          <Home />
        </IconButton>
      </Tooltip>
    </Box>
  );
});

// Tách Breadcrumb link thành component riêng
const BreadcrumbLink = memo(function BreadcrumbLink({
  segment,
  to,
  last,
  pathSegments,
}: {
  segment: string;
  to: string;
  last: boolean;
  pathSegments: string[];
}) {
  const linkSx = useMemo(
    () => ({
      color: last ? "black" : "gray",
      fontSize: 24,
    }),
    [last]
  );

  const href = segment === "edit" ? `/dashboard/${pathSegments[0]}` : to;

  return (
    <MuiLink component={Link} sx={linkSx} to={href} underline="hover">
      {segment in breadcrumbLabels
        ? breadcrumbLabels[segment as keyof typeof breadcrumbLabels]
        : segment}
    </MuiLink>
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
    <Box sx={{ display: "flex" }}>
      {/* Sidebar cho Desktop */}
      {!isMobile && (
        <DashboardSidebar open={isSidebarOpen} onToggle={handleSidebarToggle} />
      )}

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
          navigate={navigate}
        />
        {/* Content */}
        <Box
          sx={{
            px: 3,
            pt: 2,
            flexGrow: 1,
            overflow: "auto",
            height: 0,
          }}
        >
            <Outlet />
        </Box>
      </Box>

      {/* Drawer cho Mobile */}
      {isMobile && (
        <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
          <DashboardSidebar open={true} onToggle={handleDrawerToggle} />
        </Drawer>
      )}
    </Box>
  );
}
