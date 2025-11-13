import { Box, Button, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import productApi from "../../services/product.api";
import ProductFilter from "../../components/Product/ProductFilter";
import ProductCart from "../../components/Product/ProductCart";
import MenuIcon from "@mui/icons-material/Menu";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    company_id: "",
    maxPrice: 100000000,
    sortBy: "price",
    sortOrder: "asc",
    color_id: "",
  });

  const fetchProduct = async (pageNumber = 1) => {
    try {
      const response = await productApi.getAll({
        page: pageNumber,
        limit: 8,
        color_id: filters.color_id || undefined,
        company_id: filters.company_id || undefined,
        maxPrice: filters.maxPrice || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setProducts(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProduct(page);
  }, [page, filters]);

  console.log("filter", filters);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        p: 3,
        maxWidth: 1200,
        mx: "auto",
        mt: 6,
      }}
    >
      {/* Bộ lọc */}
 
      <Box sx={{ position: "sticky", top: 80, alignSelf: "flex-start" }}>
        <ProductFilter onFilter={setFilters} />
      </Box>

      {/* Danh sách sản phẩm */}
      <Box sx={{ flex: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {products.length === 0 ? (
            <Box>Không có sản phẩm nào phù hợp.</Box>
          ) : (
            products.map((product) => {
              const sortedColors = [...(product.ProductColors || [])].sort(
                (a, b) => a.productColor_id - b.productColor_id
              );
              return (
                <ProductCart
                  key={product.product_id}
                  product={product}
                  image={sortedColors}
                />
              );
            })
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
            sx={{ "& .MuiPaginationItem-root": { fontSize: "1rem" } }}
          />
        </Box>
      </Box>
    </Box>
  );
}
