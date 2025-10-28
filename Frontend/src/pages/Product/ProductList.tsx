import { Box, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import productApi from "../../services/product.api";
import ProductFilter from "../../components/Product/ProductFilter";
import ProductCart from "../../components/Product/ProductCart";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{ brand: string; price: number }>({
    brand: "",
    price: 0,
  });

  const fetchProduct = async (pageNumber = 1) => {
    try {
      const response = await productApi.getAll({ page: pageNumber, limit: 8 });
      setProducts(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };


  useEffect(() => {
    fetchProduct(page);
  }, [page]);

  const filteredProducts = products.filter((p) => {
    const byBrand = filters.brand
      ? p.company_id === Number(filters.brand)
      : true;
    const byPrice = filters.price ? p.price <= filters.price : true;
    return byBrand && byPrice;
  });

  return (
    <Box
      sx={{ display: "flex", gap: 3, p: 3, maxWidth: 1200, mx: "auto", mt: 6 }}
    >
      {/* Bộ lọc */}
      <Box
        sx={{
          flex: 1,
          position: "sticky",
          top: 80,
          alignSelf: "flex-start",
        }}
      >
        <ProductFilter onFilter={setFilters} />
      </Box>

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
          {filteredProducts.length === 0 ? (
            <Box>Không có sản phẩm nào phù hợp.</Box>
          ) : (
            filteredProducts.map((product) => (
              <ProductCart
                key={product.product_id}
                product={product}
                image={product.ProductColors}
              />
            ))
          )}
        </Box>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
