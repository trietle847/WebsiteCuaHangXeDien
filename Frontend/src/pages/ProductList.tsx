import { Box } from "@mui/material";
import ProductCart from "../components/product/ProductCart";
import FilterProduct from "../components/product/FilterProduct";
import SearchInput from "../components/product/SearchInput";

export default function ProductList() {
  return (
    <Box>
      <div className="flex gap-6 p-10 bg-gray-50 min-h-screen">
        <FilterProduct />
        <div className="flex-[3] ">
          <SearchInput />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
          </div>
        </div>
      </div>
    </Box>
  );
}
