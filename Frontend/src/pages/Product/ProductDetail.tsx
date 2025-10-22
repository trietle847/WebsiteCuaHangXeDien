import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import productApi from "../../services/product.api";
import ProductCart from "../../components/Product/ProductCart";
import ProductBanner from "../../components/Product/ProductBanner";
import Specifications from "../../components/Product/Specifications";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const relatedProductsSlice = showAll
    ? relatedProducts.slice(0, 5)
    : relatedProducts;
  useEffect(() => {
    if (product) {
      const filtered = products.filter(
        (p) =>
          p.company_id === product.company_id &&
          p.product_id !== product.product_id
      );
      setRelatedProducts(filtered);
    }
  }, [product, products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getAllProduct = await productApi.getAll();
        const getProduct = await productApi.getById(id);
        setProducts(getAllProduct.data);
        setProduct(getProduct.data);
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    };
    if (id) fetchData();
  }, [id]);

  console.log({ product, products });

  if (!product) {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        Đang tải sản phẩm...
      </Typography>
    );
  }
  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 5, gap: 3 }}>
      <Box>
        <ProductBanner product={product} />
      </Box>
      <Box>
        <Specifications productDetail={product.ProductDetail} />
      </Box>

      <Box my={5}>
        <Typography variant="h6" fontWeight="bold">
          Sản phẩm liên quan
        </Typography>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              gap: 2,
              width: "100%",
              maxWidth: 1200,
            }}
          >
            {relatedProductsSlice?.map((prod) => (
              <ProductCart
                key={prod.product_id}
                product={prod}
                image={prod.ProductColors}
              />
            ))}
          </Box>
        </Box>

        {relatedProducts && relatedProducts.length > 5 && (
          <Typography
            variant="body1"
            onClick={() => setShowAll(!showAll)}
            sx={{
              cursor: "pointer",
              color: "blue",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showAll ? "Thu gọn" : "Xem thêm"}
          </Typography>
        )}
      </Box>
      <Box>
        <Typography>Đánh giá sản phẩm</Typography>
      </Box>
    </Box>
  );
}
