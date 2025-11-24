import { Box, Typography, Link as MuiLink } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  name: string; // tên trạng
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" gap={0.5} mb={3}  p={2} flexWrap="wrap" sx={{background: "#F1F1F1"}}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Box key={index} display="flex" alignItems="center" gap={0.5}>
            {item.path && !isLast ? (
              <MuiLink
                component="button"
                variant="body2"
                onClick={() => navigate(item.path!)}
                sx={{
                  color: "#888",
                  textTransform: "none",
                  fontWeight: "normal",
                }}
              >
                {item.name}
              </MuiLink>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: isLast ? "red" : "#888",
                  textTransform: "none",
                  fontWeight: "normal",
                  fontSize: 18
                }}
              >
                {item.name}
              </Typography>
            )}

            {index < items.length - 1 && (
              <Typography variant="body2" sx={{ color: "#888" }}>
                <ArrowForwardIosIcon sx={{fontSize: 18}}/>
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
