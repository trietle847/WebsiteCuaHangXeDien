import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Stack,
} from "@mui/material";
import companyApi from "../../services/company.api";
import colorApi from "../../services/color.api";

interface ProductFilterProps {
  onFilter: (filters: {
    company_id: string;
    maxPrice: number;
    sortBy: string;
    sortOrder: string;
    color_id: string; 
  }) => void;
}

export default function ProductFilter({ onFilter }: ProductFilterProps) {
  const [company_id, setCompanyId] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [companies, setCompanies] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);

  // Lấy dữ liệu filter
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [resCompany, resColor] = await Promise.all([
          companyApi.getAll(),
          colorApi.getAll(),
        ]);
        setCompanies(resCompany.data || []);
        setColors(resColor.data || []);
      } catch (e) {
        console.error("Lỗi lấy dữ liệu bộ lọc", e);
      }
    };
    fetchFilters();
  }, []);

  const handlePriceChange = (_: Event, value: number | number[]) =>
    setMaxPrice(value as number);

  const toggleColor = (id: number) =>
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleSubmit = () =>
    onFilter({
      company_id,
      maxPrice,
      sortBy,
      sortOrder,
      color_id: selectedColors.length ? selectedColors.join(",") : "",
    });

  const handleReset = () => {
    setCompanyId("");
    setMaxPrice(100000000);
    setSortBy("price");
    setSortOrder("asc");
    setSelectedColors([]);
    onFilter({
      company_id: "",
      maxPrice: 100000000,
      sortBy: "price",
      sortOrder: "asc",
      color_id: "",
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        width: 280,
        boxShadow: 1,
        bgcolor: "#fff",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          Bộ lọc sản phẩm
        </Typography>

        {/* Thương hiệu */}
        <FormControl fullWidth size="small">
          <InputLabel>Thương hiệu</InputLabel>
          <Select
            value={company_id}
            onChange={(e) => setCompanyId(e.target.value)}
            label="Thương hiệu"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.company_id} value={c.company_id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Giá tối đa */}
        <Box>
          <Typography variant="body2">
            Giá tối đa: {maxPrice.toLocaleString()} ₫
          </Typography>
          <Slider
            value={maxPrice}
            min={1}
            max={100000000}
            step={500000}
            size="small"
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Màu sắc */}
        <Box>
          <Typography variant="body2" gutterBottom>
            Chọn màu sắc:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {colors.map((color) => (
              <Button
                key={color.color_id}
                onClick={() => toggleColor(color.color_id)}
                sx={{
                  width: 28,
                  height: 28,
                  minWidth: 0,
                  borderRadius: "50%",
                  border: selectedColors.includes(color.color_id)
                    ? "2px solid #1976d2"
                    : "1px solid #ccc",
                  bgcolor: color.code || "#ddd",
                  p: 0,
                  "&:hover": {
                    bgcolor: color.code || "#ddd",
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Sắp xếp */}
        <FormControl fullWidth size="small">
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sắp xếp theo"
          >
            <MenuItem value="price">Giá</MenuItem>
            <MenuItem value="average_rating">Đánh giá</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Thứ tự</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Thứ tự"
          >
            <MenuItem value="asc">Tăng dần</MenuItem>
            <MenuItem value="desc">Giảm dần</MenuItem>
          </Select>
        </FormControl>

        {/* Nút */}
        <Stack spacing={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Tìm kiếm
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleReset}
          >
            Tất cả
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
