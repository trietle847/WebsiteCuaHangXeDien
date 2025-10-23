import { use, useEffect, useState } from "react";
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
import companyApi from "../../services/company.api";

interface ProductFilterProps {
  onFilter: (filters: { brand: string; price: number }) => void;
  onReset?: () => void;
}

export default function ProductFilter({
  onFilter,
  onReset,
}: ProductFilterProps) {
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(100000000);
  const [companies, setCompanies] = useState<any[]>([]);

  const fetchCompany = async () => {
    try {
      const response = await companyApi.getAll();
      console.log({ response });
      setCompanies(response.data);
    } catch (e) {
      console.log("Lỗi lấy danh sách company", e);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPrice(newValue as number);
  };

  const handleSubmit = () => {
    console.log({ brand, price });
    onFilter({ brand, price });
  };

  const handleReset = () => {
    setBrand("");
    setPrice(100000000);
    onFilter({ brand: "", price: Infinity });
    if (onReset) onReset();
  };

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        width: 300,
        boxShadow: 3,
        bgcolor: "#fff",
      }}
    >
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
          <MenuItem value="">Tất cả</MenuItem>
          {companies.map((company: any) => (
            <MenuItem key={company.company_id} value={company.company_id}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography gutterBottom>
        Giá tối đa: {price.toLocaleString()} ₫
      </Typography>
      <Slider
        value={price}
        min={1}
        max={100000000}
        step={500000}
        valueLabelDisplay="auto"
        onChange={handlePriceChange}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 2 }}
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
        All
      </Button>
    </Box>
  );
}
