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
      key={comment.feedback_id}
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        backgroundColor: "#ffffff",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            width: 48,
            height: 48,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {comment.User?.first_name?.[0]?.toUpperCase() || "U"}
        </Avatar>

        <Box>
          {/* Tên + rating cùng hàng */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography fontWeight={600} color="#1976d2" sx={{ fontSize: 16 }}>
              {comment.User
                ? `${comment.User.first_name} ${comment.User.last_name}`
                : `Người dùng #${comment.user_id}`}
            </Typography>

            {rating && (
              <Tooltip title={`${comment.rating || 0} / 5`} arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f5f7fb",
                    borderRadius: "20px",
                    px: 1,
                    py: 0.3,
                    boxShadow: "inset 0 0 3px rgba(0,0,0,0.05)",
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
                    sx={{ ml: 0.4, fontWeight: 500, color: "#555" }}
                  >
                    {comment.stars?.toFixed(1) || "0.0"}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>

          {/* Thời gian */}
          <Typography variant="caption" color="text.secondary">
            {new Date(comment.createdAt).toLocaleString("vi-VN")}
          </Typography>
        </Box>
      </Box>

      {/* Nội dung comment */}
      <Typography
        sx={{
          mt: 1.8,
          ml: 7,
          whiteSpace: "pre-wrap",
          lineHeight: 1.7,
          fontSize: 15.2,
          color: "#333",
        }}
      >
        {comment.content}
      </Typography>

      <Divider sx={{ mt: 2, ml: 7 }} />
    </Box>
  );
}
