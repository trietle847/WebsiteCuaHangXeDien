import { Box, Pagination, Button, Drawer, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import productApi from "../../services/product.api";
import ProductFilter from "../../components/Product/ProductFilter";
import ProductCart from "../../components/Product/ProductCart";

export default function ProductList() {
  const keyword = useSelector((state: any) => state.search.query);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    company_id: "",
    maxPrice: 100000000,
    sortBy: "price",
    sortOrder: "asc",
    color_id: "",
  });

  // 👉 Không cần theme — dùng trực tiếp media query
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [openFilter, setOpenFilter] = useState(false);

  const fetchProduct = async (pageNumber = 1) => {
    try {
      const response = await productApi.getAll({
        page: pageNumber,
        limit: 8,
        keyword: keyword || undefined,
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
    setPage(1);
  }, [filters, keyword]);

  useEffect(() => {
    fetchProduct(page);
  }, [page, filters, keyword]);

  return (
    <Box
      sx={{ display: "flex", gap: 3, p: 3, maxWidth: 1200, mx: "auto", mt: 6 }}
    >
      {/* Desktop Filter */}
      {!isMobile && (
        <Box
          sx={{
            position: "sticky",
            top: 80,
            alignSelf: "flex-start",
            minWidth: 260,
          }}
        >
          <ProductFilter
            onFilter={(f: any) => setFilters((prev) => ({ ...prev, ...f }))}
          />
        </Box>
      )}

      {/* Mobile Filter */}
      {isMobile && (
        <>
          <Button
            variant="contained"
            sx={{
              position: "fixed",
              bottom: 20,
              left: 20,
              zIndex: 1,
              borderRadius: 2,
            }}
            onClick={() => setOpenFilter(true)}
          >
            Bộ lọc
          </Button>

          <Drawer
            anchor="left"
            open={openFilter}
            onClose={() => setOpenFilter(false)}
            PaperProps={{ sx: { width: "50%" } }}
          >
            <Box sx={{ p: 2 }}>
              <ProductFilter
                onFilter={(f: any) => {
                  setFilters((prev) => ({ ...prev, ...f }));
                  setOpenFilter(false);
                }}
              />
            </Box>
          </Drawer>
        </>
      )}

      {/* Product Grid */}
      <Box sx={{ flex: 1 }}>
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
            <Box>
              Không có sản phẩm nào phù hợp
              {keyword ? ` với từ khóa "${keyword}"` : ""}.
            </Box>
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
          />
        </Box>
      </Box>
    </Box>
  );
}
