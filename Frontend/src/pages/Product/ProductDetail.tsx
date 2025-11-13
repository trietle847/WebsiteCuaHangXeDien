import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import productApi from "../../services/product.api";
import ProductCart from "../../components/Product/ProductCart";
import ProductBanner from "../../components/Product/ProductBanner";
import Specifications from "../../components/Product/Specifications";
import ProductComment from "../../components/Product/Comment/Comment";
import Rating from "../../components/Product/Comment/Rating";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ hook navigate
  const [product, setProduct] = useState<any>(null);
  const [tab, setTab] = useState(0);
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

  if (!product) {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        Đang tải sản phẩm...
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 5, gap: 3 }}>
      <IconButton onClick={() => navigate(-1)}>
        <Typography variant="body1">
          Quay lại
        </Typography>
      </IconButton>

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

      {/* Tabs Bình luận & Đánh giá */}
      <Box>
        <Box display="flex" gap={2} mb={2}>
          <Typography
            onClick={() => setTab(0)}
            sx={{
              cursor: "pointer",
              fontWeight: tab === 0 ? "bold" : "normal",
              color: tab === 0 ? "primary.main" : "text.secondary",
              borderBottom:
                tab === 0 ? "2px solid #1976d2" : "2px solid transparent",
              px: 1,
            }}
          >
            Bình luận
          </Typography>

          <Typography
            onClick={() => setTab(1)}
            sx={{
              cursor: "pointer",
              fontWeight: tab === 1 ? "bold" : "normal",
              color: tab === 1 ? "primary.main" : "text.secondary",
              borderBottom:
                tab === 1 ? "2px solid #1976d2" : "2px solid transparent",
              px: 1,
            }}
          >
            Đánh giá
          </Typography>
        </Box>

        <Box>
          {tab === 0 && <ProductComment product_id={id ?? ""} />}
          {tab === 1 && <Rating product_id={id ?? ""} />}
        </Box>
      </Box>
    </Box>
  );
}
