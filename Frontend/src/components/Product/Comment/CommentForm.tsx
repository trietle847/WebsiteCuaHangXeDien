import { Box, Typography, TextField, Button, Rating } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const CommentForm = ({ onSubmit, status = false }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: { content: "", stars: 0 },
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 4,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        backgroundColor: "#fafafa",
      }}
    >
      {status && (
        <Controller
          name="stars"
          control={control}
          rules={{ required: "Vui lòng chọn số sao đánh giá" }}
          render={({ field, fieldState }) => (
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Đánh giá sản phẩm:
              </Typography>
              <Rating
                {...field}
                value={field.value || 0}
                onChange={(_, value) => field.onChange(value)}
              />
              {fieldState.error && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {fieldState.error.message}
                </Typography>
              )}
            </Box>
          )}
        />
      )}

      <Controller
        name="content"
        control={control}
        rules={{ required: "Vui lòng nhập nội dung bình luận" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            multiline
            rows={3}
            placeholder="Nhập bình luận của bạn..."
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ alignSelf: "flex-end", px: 3, borderRadius: 2 }}
      >
        Gửi bình luận
      </Button>
    </Box>
  );
};

export default CommentForm;
