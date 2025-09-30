import { Box } from "@mui/material";
import ProductFilter from "../components/product/ProductFilter";
import ProductCart from "../components/product/ProductCart";
import Pagination from "@mui/material/Pagination";
const products = [
  {
    id: 1,
    name: "Xe điện VinFast Evo 200",
    price: 10000000,
    stock_quantity: 12,
    specifications: "Pin LFP 3.5kWh, vận tốc tối đa 50km/h",
    image:
      "https://vinfastphunhuan.com/thumbnail/480x540x1/upload/product/782dcf1f73f2df279b72f5b2dfd7d1d8-8198.jpg",
    average_rating: 4.5,
  },
  {
    id: 2,
    name: "Xe điện VinFast Ludo",
    price: 12000000,
    stock_quantity: 10,
    specifications: "Pin 4kWh, vận tốc tối đa 55km/h",
    image:
      "https://vinfastphunhuan.com/thumbnail/480x540x1/upload/product/782dcf1f73f2df279b72f5b2dfd7d1d8-8198.jpg",
    average_rating: 4.7,
  },
  {
    id: 3,
    name: "Xe máy Yamaha X1",
    price: 8000000,
    stock_quantity: 8,
    specifications: "Pin 2.5kWh, vận tốc tối đa 45km/h",
    image:
      "https://vinfastphunhuan.com/thumbnail/480x540x1/upload/product/782dcf1f73f2df279b72f5b2dfd7d1d8-8198.jpg",
    average_rating: 4.2,
  },
  {
    id: 4,
    name: "Xe Honda Z3",
    price: 9000000,
    stock_quantity: 5,
    specifications: "Pin 3kWh, vận tốc tối đa 48km/h",
    image:
      "https://vinfastphunhuan.com/thumbnail/480x540x1/upload/product/782dcf1f73f2df279b72f5b2dfd7d1d8-8198.jpg",
    average_rating: 4.0,
  },
  {
    id: 5,
    name: "Xe Honda Z3",
    price: 9000000,
    stock_quantity: 5,
    specifications: "Pin 3kWh, vận tốc tối đa 48km/h",
    image:
      "https://vinfastphunhuan.com/thumbnail/480x540x1/upload/product/782dcf1f73f2df279b72f5b2dfd7d1d8-8198.jpg",
    average_rating: 4.0,
  },
];

export default function FilterProduct() {
  return (
    <Box sx={{ display: "flex", gap: 3, p: 3 }}>
      <Box>
        <ProductFilter />
      </Box>
      <Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {products.map((p) => (
            <ProductCart key={p.id} product={p} />
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination count={10} size="small" />
        </Box>
      </Box>
    </Box>
  );
}
