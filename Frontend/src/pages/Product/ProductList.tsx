import {
  Box,
  Pagination,
  Button,
  Drawer,
  useMediaQuery,
  Typography,
  Container,
  Paper,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import productApi from "../../services/product.api";
import ProductFilter from "../../components/Product/ProductFilter";
import ProductCart from "../../components/Product/ProductCard";
import { FilterList, SearchOff, Close } from "@mui/icons-material";
import Breadcrumbs from "../../layouts/Breadcrumbs";
import { useTheme } from "@mui/material/styles";

export default function ProductList() {
  const theme = useTheme();
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

  // Breakpoint md (900px) là chuẩn để chuyển giao diện mobile/desktop
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, filters, keyword]);

  return (
    <Box sx={{ pb: 8, minHeight: "100vh", bgcolor: "#fff" }}>
      <Breadcrumbs
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/products" },
        ]}
      />

      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{ borderBottom: "1px solid #eee", pb: 2 }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ textTransform: "capitalize" }}
            >
              {keyword ? `Kết quả: "${keyword}"` : "Tất cả sản phẩm"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Tìm thấy {products.length > 0 ? products.length : "0"} sản phẩm
              phù hợp
            </Typography>
          </Box>

          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setOpenFilter(true)}
              size="small"
            >
              Bộ lọc
            </Button>
          )}
        </Stack>

        <Box sx={{ display: "flex", gap: 4 }}>
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  position: "sticky",
                  top: 100,
                }}
              >
                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                  <FilterList color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Bộ lọc
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                <ProductFilter
                  onFilter={(f: any) =>
                    setFilters((prev) => ({ ...prev, ...f }))
                  }
                />
              </Paper>
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            {products.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 8,
                  textAlign: "center",
                  bgcolor: "#f9f9f9",
                  borderRadius: 2,
                  border: "1px dashed #ccc",
                }}
              >
                <SearchOff
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không tìm thấy sản phẩm nào
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Hãy thử thay đổi từ khóa hoặc xóa bộ lọc tìm kiếm
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 2.5,
                }}
              >
                {products.map((product) => {
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
                })}
              </Box>
            )}

            {products.length > 0 && (
              <Stack alignItems="center" mt={6}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            )}
          </Box>
        </Box>
      </Container>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        PaperProps={{
          sx: { width: "85%", maxWidth: 360 },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Bộ lọc tìm kiếm
          </Typography>
          <IconButton onClick={() => setOpenFilter(false)}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <ProductFilter
            onFilter={(f: any) => {
              setFilters((prev) => ({ ...prev, ...f }));
              setOpenFilter(false);
            }}
          />
        </Box>

        <Box sx={{ p: 2, mt: "auto", borderTop: "1px solid #eee" }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setOpenFilter(false)}
          >
            Xem kết quả
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
