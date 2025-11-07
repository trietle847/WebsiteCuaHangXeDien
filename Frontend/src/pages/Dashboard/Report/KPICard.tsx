import { Tooltip, Box, Card, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { NumericFormat } from "react-number-format";
import type { SvgIconProps } from "@mui/material";

interface KPICardProps {
  title: string;
  Icon?: React.ElementType<SvgIconProps>;
  gradientColors?: [string, string]; // Gradient colors [from, to]
  format?: "number" | "currency";
  value: number | string;
  change?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export default function KPICard({
  title,
  Icon,
  gradientColors = ["#6366f1", "#8b5cf6"], // Default purple gradient
  value,
  change,
  format = "number",
}: KPICardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 200,
        background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
        color: "white",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ p: 3, position: "relative", zIndex: 1 }}>
        {/* Icon and Title */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          {Icon && (
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "12px",
                p: 1.5,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ fontSize: 32, color: "white" }} />
            </Box>
          )}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              opacity: 0.95,
              textTransform: "uppercase",
              fontSize: "0.875rem",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Value */}
        <Box sx={{ mb: 2 }}>
          {format === "currency" ? (
            <Tooltip
              title={
                <NumericFormat
                  value={Number(value)}
                  displayType={"text"}
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                />
              }
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                }}
              >
                {formatCurrency(Number(value))}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", sm: "2.5rem" },
              }}
            >
              {value}
            </Typography>
          )}
        </Box>

        {/* Change indicator */}
        {change !== undefined && change !== 0 && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              bgcolor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "20px",
              px: 1.5,
              py: 0.5,
            }}
          >
            {change > 0 ? (
              <ArrowUpward sx={{ fontSize: 16, mr: 0.5, color: "green" }} />
            ) : (
              <ArrowDownward sx={{ fontSize: 16, mr: 0.5, color: "red" }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: 600 }} color={change > 0 ? "green" : "red"}>
              {Math.abs(change)}% so với tháng trước
            </Typography>
          </Box>
        )}
      </Box>

      {/* Decorative background circles */}
      <Box
        sx={{
          position: "absolute",
          right: -30,
          bottom: -30,
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: -10,
          top: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          zIndex: 0,
        }}
      />
    </Card>
  );
}
