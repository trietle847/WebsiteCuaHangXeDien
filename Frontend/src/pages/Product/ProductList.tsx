import { Box } from "@mui/material";
import ProductFilter from "../Product/components/ProductFilter";
import ProductCart from "../Product/components/ProductCart";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import productApi from "../../services/product.api";
// import type { Product } from "../../services/product.api";
import imageApi from "../../services/image.api";

export default function FilterProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ brand: string; price: number }>({
    brand: "",
    price: 0,
  });
  const itemsPerPage = 8;

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const data = await productApi.getAll();
  //       setProducts(data.products);
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Lỗi khi fetch sản phẩm:", error);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const data = await imageApi.getAll();
  //       setImages(data.images);
  //     } catch (error) {
  //       console.error("Lỗi khi fetch ảnh:", error);
  //     }
  //   };
  //   fetchImages();
  // }, []);

    const fetchProduct = async () => {
      try {
        const response = await productApi.getAll();
        const productWithImages = await Promise.all(
          response.products.map(async (prod: any) => {
            try {
              const imgRes = await imageApi.getById(prod.product_id);
              return {
                ...prod,
                image: imgRes.image[0].url,
              };
            } catch (error) {
              console.error(
                `Không lấy được ảnh của sản phẩm ${prod.product_id}`,
                error
              );
              return { ...prod, image: null };
            }
          })
        );
        setProducts(productWithImages);
        console.log(productWithImages);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
  
    useEffect(() => {
      fetchProduct();
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
    <Box sx={{ display: "flex", gap: 3, p: 3, alignItems: "flex-start" }}>
      <Box>
        <ProductFilter onFilter={setFilters} />
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
          {currentProducts.length === 0 ? (
            <Box>Không có sản phẩm nào phù hợp.</Box>
          ) : (
            currentProducts.map((product: any) => {
              return (
                <ProductCart
                  key={product.product_id}
                  product={product}
                />
              );
            })
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          {currentProducts.length > 0 && (
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
