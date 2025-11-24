import {
  Box,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
  Tooltip,
  Divider,
  Typography,
  MenuItem,
} from "@mui/material";
import {
  Menu,
  Inventory,
  AssignmentTurnedIn,
  Person,
  Assessment,
  Discount,
  AccountCircle,
  Logout,
  Build
} from "@mui/icons-material";
import { useState, memo, useMemo, type JSX } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const InventoryIcon = <Inventory />;
const DiscountIcon = <Discount />;
const PersonIcon = <Person />;
const AssignmentIcon = <AssignmentTurnedIn />;
const AssessmentIcon = <Assessment />;
const BuildIcon = <Build />;

const navLinks = [
  { title: "Sản phẩm", path: "/dashboard/products", icon: InventoryIcon },
  { title: "Khuyến mãi", path: "/dashboard/promotions", icon: DiscountIcon },
  { title: "Người dùng", path: "/dashboard/users", icon: PersonIcon },
  { title: "Đơn hàng", path: "/dashboard/orders", icon: AssignmentIcon },
  { title: "Dịch vụ", path: "/dashboard/services", icon: BuildIcon },
  { title: "Báo cáo", path: "/dashboard/reports", icon: AssessmentIcon },
];

function SidebarContent({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}): JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { userInfo, logout } = useAuth();

  const getRoleLabel = () => {
    switch (userInfo?.role) {
      case "admin":
        return "Quản trị viên";
      case "mechanic":
        return "Kỹ thuật viên";
      default:
        return "Nhân viên";
    }
  };

  const containerSx = useMemo(
    () => ({
      width: open ? 250 : 70,
      height: "100vh",
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      willChange: "width",
      contain: "layout style",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      flexShrink: 0, // Ngăn sidebar bị shrink khi dùng flex
    }),
    [open]
  );

  // Memoize các styles thay vì tạo mới mỗi render
  const listSx = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: 2,
      width: "100%",
      mt: 2,
    }),
    []
  );

  return (
    <Box
      className="bg-gradient-to-b from-blue-900 to-blue-800 text-white"
      sx={containerSx}
      role="presentation"
    >
      <Box>
        <Box
          sx={{
            height: 55,
            display: "flex",
            p: 2,
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{
              display: { xs: "none", md: "inline-flex" },
              color: "inherit",
              mr: 2,
            }}
            onClick={onToggle}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              display: open ? "inline-flex" : "none",
              cursor: "default",
              textAlign: "center",
            }}
          >
            Emotor
          </Typography>
        </Box>

        <Divider
          sx={{
            backgroundColor: "white",
          }}
        />
        <List disablePadding sx={listSx}>
          {navLinks.map((link) => {
            const isActive = currentPath.startsWith(link.path);

            return (
              <SidebarItem
                key={link.path}
                link={link}
                isActive={isActive}
                open={open}
              />
            );
          })}
        </List>
      </Box>
      <Box>
        <Divider sx={{ bgcolor: "white" }} />
        <MuiMenu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              sx: {
                width: 235,
                ml: -1,
                mt: -1,
              },
            },
          }}
        >
          <MenuItem component={Link} to="/profile">
            <AccountCircle sx={{ mr: 1, color: "blue", fontSize: 28 }} /> Hồ sơ
            cá nhân
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              logout();
              handleMenuClose();
            }}
            sx={{
              color: "red",
            }}
          >
            <Logout sx={{ mr: 1 }} />
            Đăng xuất{" "}
          </MenuItem>
        </MuiMenu>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
            cursor: "pointer",
            p: 1,
          }}
          onClick={handleMenuOpen}
        >
          <Tooltip title={open ? "" : "Thông tin tài khoản"} placement="right">
            <IconButton>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {userInfo?.first_name?.charAt(0).toUpperCase()}
              </Box>
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 500,
                display: open ? "inline-flex" : "none",
                ml: 1,
              }}
            >
              {`${userInfo?.first_name}` || `Nhân viên`}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ display: open ? "inline-flex" : "none", ml: 1 }}
            >
              {getRoleLabel()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// Tách ListItem thành component riêng để memo từng item
const SidebarItem = memo(function SidebarItem({
  link,
  isActive,
  open,
}: {
  link: { title: string; path: string; icon: JSX.Element };
  isActive: boolean;
  open: boolean;
}) {
  const buttonSx = useMemo(
    () => ({
      width: "100%",
      minHeight: 48,
      justifyContent: "flex-start",
      bgcolor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
      "&:hover": {
        bgcolor: isActive
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(255, 255, 255, 0.1)",
      },
    }),
    [isActive]
  );

  const textSx = useMemo(
    () => ({
      opacity: open ? 1 : 0,
      transition: "opacity 0.2s ease",
      transitionDelay: open ? "0.1s" : "0s",
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
    }),
    [open]
  );

  const iconSx = useMemo(
    () => ({
      color: "inherit",
      minWidth: 40,
      mr: open ? 2 : 0,
      justifyContent: "center",
    }),
    [open]
  );

  return (
    <ListItem
      disablePadding
      component={Link}
      to={link.path}
      sx={{ color: "inherit", textDecoration: "none" }}
    >
      <ListItemButton sx={buttonSx}>
        <Tooltip title={open ? "" : link.title} placement="right">
          <ListItemIcon sx={iconSx}>{link.icon}</ListItemIcon>
        </Tooltip>
        <Box sx={textSx}>{open && <ListItemText primary={link.title} />}</Box>
      </ListItemButton>
    </ListItem>
  );
});

export default memo(SidebarContent);
