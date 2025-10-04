import { Box } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import productApi from "../../services/product.api";
import type { Product } from "../../services/product.api";
import imageApi from "../../services/image.api";
import type { Image } from "../../services/image.api";
import ProductFilter from "../../components/Product/ProductFilter";
import ProductCart from "../../components/Product/ProductCart";

export default function FilterProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ brand: string; price: number }>({
    brand: "",
    price: 200000000,
  });
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();
        setProducts(data.products);
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await imageApi.getAll();
        setImages(data.images);
      } catch (error) {
        console.error("Lỗi khi fetch ảnh:", error);
      }
    };
    fetchImages();
  }, []);

  const filteredProducts = products.filter((p) => {
    // const byBrand = filters.brand ? p.brand === filters.brand : true;
    const byPrice = filters.price ? p.price <= filters.price : true;
    return byPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box
      sx={{ display: "flex", gap: 3, p: 3, maxWidth: 1200, mx: " auto", mt: 6 }}
    >
      <Box sx={{ flex: 1 }}>
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
          {currentProducts.length === 0 ? (
            <Box>Không có sản phẩm nào phù hợp.</Box>
          ) : (
            currentProducts.map((product) => {
              const productImage = images.find(
                (img) => img.product_id === product.product_id
              );
              return (
                <ProductCart
                  key={product.product_id}
                  product={product}
                  image={productImage}
                />
              );
            })
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_e, value) => setPage(value)}
              color="primary"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
