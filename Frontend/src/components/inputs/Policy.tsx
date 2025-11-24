import {
  Box,
  Button,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { type Control, useFieldArray, Controller } from "react-hook-form";
import { RemoveCircle, Add } from "@mui/icons-material";
import { memo } from "react";

interface PolicyInputProps {
  control: Control<any>;
  forProduct?: boolean;
}

// Memoize từng field item để tránh re-render không cần thiết
const MaintenanceField = memo(({ control, index, onRemove }: any) => (
  <Box>
    {index > 0 && <Divider sx={{ mb: 2 }} />}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr 2fr auto",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        Mốc {index + 1}
      </Box>

      <Controller
        name={`maintenance_policy.${index}.interval_months`}
        control={control}
        rules={{
          required: "Số tháng là bắt buộc",
          min: { value: 1, message: "Số tháng phải lớn hơn 0" },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            value={field.value || ""}
            label="Số tháng"
            variant="outlined"
            type="number"
            required
            inputProps={{ min: 1 }}
            error={!!error}
            helperText={error?.message}
            onChange={(e) => {
              const val = e.target.value;
              field.onChange(val === "" ? "" : Number(val));
            }}
          />
        )}
      />

      <Controller
        name={`maintenance_policy.${index}.task`}
        control={control}
        rules={{
          required: "Nội dung bảo dưỡng là bắt buộc",
          minLength: { value: 5, message: "Nội dung tối thiểu 5 ký tự" },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Nội dung bảo dưỡng"
            variant="outlined"
            size="small"
            required
            multiline
            rows={2}
            placeholder="Mô tả chi tiết công việc bảo dưỡng..."
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Tooltip title="Xóa mốc này">
        <IconButton onClick={onRemove} color="error" size="small">
          <RemoveCircle />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
));

const WarrantyField = memo(({ control, index, onRemove }: any) => (
  <Box>
    {index > 0 && <Divider sx={{ mb: 2 }} />}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 2fr auto",
        gap: 2,
        alignItems: "start",
      }}
    >
      <Controller
        name={`warranty_policy.${index}.category`}
        control={control}
        rules={{ required: "Hạng mục bảo hành là bắt buộc" }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Hạng mục bảo hành"
            variant="outlined"
            required
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name={`warranty_policy.${index}.duration_months`}
        control={control}
        rules={{
          required: "Thời gian bảo hành là bắt buộc",
          min: { value: 1, message: "Thời gian phải lớn hơn 0" },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            value={field.value || ""}
            label="Thời gian bảo hành (tháng)"
            variant="outlined"
            type="number"
            required
            inputProps={{ min: 1 }}
            error={!!error}
            helperText={error?.message}
            onChange={(e) => {
              const val = e.target.value;
              field.onChange(val === "" ? "" : Number(val));
            }}
          />
        )}
      />

      <Controller
        name={`warranty_policy.${index}.details`}
        control={control}
        rules={{
          minLength: { value: 5, message: "Chi tiết tối thiểu 5 ký tự" },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Chi tiết bảo hành"
            variant="outlined"
            size="small"
            multiline
            rows={2}
            placeholder="Mô tả chi tiết điều kiện bảo hành..."
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Tooltip title="Xóa mục này">
        <IconButton onClick={onRemove} color="error" size="small">
          <RemoveCircle />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
));

export default function PolicyInput({
  control,
  forProduct = true,
}: PolicyInputProps) {
  const {
    fields: mf,
    append: ma,
    remove: mr,
  } = useFieldArray({
    control,
    name: "maintenance_policy",
  });

  const {
    fields: wf,
    append: wa,
    remove: wr,
  } = useFieldArray({
    control,
    name: "warranty_policy",
  });

  const handleAddMilestone = () => {
    ma({ interval_months: "", task: "" });
  };

  const handleAddWarranty = () => {
    wa({ category: "", duration_months: "", details: "" });
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Chính sách bảo dưỡng
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddMilestone}
              size="small"
            >
              Thêm mốc
            </Button>
          </Box>

          {mf.length === 0 && (
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                Chưa có mục bảo dưỡng nào. Nhấn "Thêm mốc" để bắt đầu.
              </Typography>
              {forProduct ? (
                <Typography
                  variant="body2"
                  color="red"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  Lưu ý: Nếu không thêm mốc bảo dưỡng, sản phẩm sẽ sử dụng chính
                  sách bảo dưỡng mặc định của hãng.
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="red"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  Lưu ý: Chính sách bảo dưỡng là bắt buộc đối với gói dịch vụ.
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {mf.map((item, index) => (
              <MaintenanceField
                key={item.id}
                control={control}
                index={index}
                onRemove={() => mr(index)}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Chính sách bảo hành
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddWarranty}
              size="small"
            >
              Thêm mục bảo hành
            </Button>
          </Box>

          {wf.length === 0 && (
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                Chưa có mục bảo hành nào. Nhấn "Thêm mục bảo hành" để bắt đầu.
              </Typography>
              {forProduct ? (
                <Typography
                  variant="body2"
                  color="red"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  Lưu ý: Nếu không thêm mục bảo hành, sản phẩm sẽ sử dụng chính
                  sách bảo hành mặc định của hãng.
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="red"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  Lưu ý: Chính sách bảo hành là bắt buộc đối với gói dịch vụ.
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {wf.map((item, index) => (
              <WarrantyField
                key={item.id}
                control={control}
                index={index}
                onRemove={() => wr(index)}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
