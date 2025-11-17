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
import Description from "../../components/Product/Description";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const [tabDescSpec, setTabDescSpec] = useState(0);
  const [tabComment, setTabComment] = useState(2);

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
        <ArrowBackIcon />
        <Typography variant="body1" ml={1}>
          Quay lại
        </Typography>
      </IconButton>

      {/* Banner sản phẩm */}
      <Box>
        <ProductBanner product={product} />
      </Box>

      {/*Mô tả ,thông số kỹ thuật */}
      <Box mt={4}>
        <Box display="flex" gap={3} mb={3}>
          <Typography
            onClick={() => setTabDescSpec(0)}
            sx={{
              cursor: "pointer",
              fontWeight: tabDescSpec === 0 ? "bold" : "normal",
              color: tabDescSpec === 0 ? "primary.main" : "text.secondary",
              borderBottom:
                tabDescSpec === 0
                  ? "2px solid #1976d2"
                  : "2px solid transparent",
              px: 1,
            }}
          >
            Mô tả
          </Typography>

          <Typography
            onClick={() => setTabDescSpec(1)}
            sx={{
              cursor: "pointer",
              fontWeight: tabDescSpec === 1 ? "bold" : "normal",
              color: tabDescSpec === 1 ? "primary.main" : "text.secondary",
              borderBottom:
                tabDescSpec === 1
                  ? "2px solid #1976d2"
                  : "2px solid transparent",
              px: 1,
            }}
          >
            Thông số kỹ thuật
          </Typography>
        </Box>

        <Box>
          {tabDescSpec === 0 && <Description product={product} />}

          {tabDescSpec === 1 && (
            <Specifications productDetail={product.ProductDetail} />
          )}
        </Box>
      </Box>

      {/* Sản phẩm liên quan */}
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
        {" "}
        <Box display="flex" gap={2} mb={2}>
          {" "}
          <Typography
            onClick={() => setTabComment(2)}
            sx={{
              cursor: "pointer",
              fontWeight: tabComment === 2 ? "bold" : "normal",
              color: tabComment === 2 ? "primary.main" : "text.secondary",
              borderBottom:
                tabComment === 2
                  ? "2px solid #1976d2"
                  : "2px solid transparent",
              px: 1,
            }}
          >
            {" "}
            Bình luận{" "}
          </Typography>{" "}
          <Typography
            onClick={() => setTabComment(3)}
            sx={{
              cursor: "pointer",
              fontWeight: tabComment === 3 ? "bold" : "normal",
              color: tabComment === 3 ? "primary.main" : "text.secondary",
              borderBottom:
                tabComment === 3
                  ? "2px solid #1976d2"
                  : "2px solid transparent",
              px: 1,
            }}
          >
            {" "}
            Đánh giá{" "}
          </Typography>{" "}
        </Box>{" "}
        <Box>
          {" "}
          {tabComment === 2 && <ProductComment product_id={id ?? ""} />}{" "}
          {tabComment === 3 && <Rating product_id={id ?? ""} />}{" "}
        </Box>{" "}
      </Box>
    </Box>
  );
}
