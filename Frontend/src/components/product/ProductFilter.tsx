import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
} from "@mui/material";


export default function ProductFilter() {
  return (
    <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2, width: 300 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bộ lọc
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Thương hiệu</InputLabel>
        <Select label="Thương hiệu" value="">
          <MenuItem value="">Chọn thương hiệu</MenuItem>
          <MenuItem value="VinFast">VinFast</MenuItem>
          <MenuItem value="Yamaha">Yamaha</MenuItem>
          <MenuItem value="Honda">Honda</MenuItem>
        </Select>
      </FormControl>

      <Typography gutterBottom>Giá trị: 20.000.000 ₫</Typography>
      <Slider
        value={20000000}
        min={0}
        max={20000000}
        step={500000}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mb: 3 }}>
        Tìm kiếm
      </Button>
    </Box>
  );
}
