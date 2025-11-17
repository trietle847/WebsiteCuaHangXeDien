import {
  Avatar,
  Box,
  Divider,
  Rating,
  Typography,
  Tooltip,
} from "@mui/material";

export default function CommentCard({
  comment,
  rating = true,
}: {
  comment: any;
  rating: boolean;
}) {
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        backgroundColor: "#fff",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Header: Avatar + Tên + Rating */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            width: 36,
            height: 36,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {comment.User?.first_name?.[0]?.toUpperCase() || "U"}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography fontWeight={600} color="#1976d2" sx={{ fontSize: 14 }}>
              {comment.User
                ? `${comment.User.first_name} ${comment.User.last_name}`
                : `Người dùng #${comment.user_id}`}
            </Typography>

            {rating && (
              <Tooltip title={`${comment.stars || 0} / 5`} arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f5f7fb",
                    borderRadius: 16,
                    px: 1,
                    py: 0.2,
                  }}
                >
                  <Rating
                    value={comment.stars || 0}
                    readOnly
                    precision={0.5}
                    size="small"
                    sx={{
                      "& .MuiRating-iconFilled": { color: "#ffb400" },
                      "& .MuiRating-iconEmpty": { color: "#ccc" },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 0.3,
                      fontWeight: 500,
                      color: "#555",
                      fontSize: 12,
                    }}
                  >
                    {comment.stars?.toFixed(1) || "0.0"}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 11 }}
          >
            {new Date(comment.createdAt).toLocaleString("vi-VN")}
          </Typography>
        </Box>
      </Box>

      {/* Nội dung comment */}
      <Typography
        sx={{
          mt: 1,
          ml: 5,
          whiteSpace: "pre-wrap",
          lineHeight: 1.5,
          fontSize: 13,
          color: "#333",
        }}
      >
        {comment.content}
      </Typography>

      <Divider sx={{ mt: 1.5, ml: 5 }} />
    </Box>
  );
}
