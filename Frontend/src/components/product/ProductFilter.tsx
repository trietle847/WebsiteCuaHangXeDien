import { useState } from "react";
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
  const [brand, setBrand] = useState(""); // cho select
  const [price, setPrice] = useState(20000000); // cho slider

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPrice(newValue as number);
  };

  return (
    <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2, width: 300 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bộ lọc
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Thương hiệu</InputLabel>
        <Select
          label="Thương hiệu"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <MenuItem value="">Chọn thương hiệu</MenuItem>
          <MenuItem value="VinFast">VinFast</MenuItem>
          <MenuItem value="Yamaha">Yamaha</MenuItem>
          <MenuItem value="Honda">Honda</MenuItem>
        </Select>
      </FormControl>

      <Typography gutterBottom>Giá trị: {price.toLocaleString()} ₫</Typography>
      <Slider
        value={price}
        min={0}
        max={20000000}
        step={500000}
        valueLabelDisplay="auto"
        onChange={handlePriceChange}
        sx={{ mb: 3 }}
      />

      <Button variant="contained" color="primary" fullWidth sx={{ mb: 3 }}>
        Tìm kiếm
      </Button>
    </Box>
  );
}
