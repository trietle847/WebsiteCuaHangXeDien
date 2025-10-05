import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import productApi from "../../services/product.api";
import imageApi from "../../services/image.api";
import ProductCart from "../../components/Product/ProductCart";
import ProductBanner from "../../components/Product/ProductBanner";
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  // const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);

  // const { id } = useParams();
  // const [product, setProduct] = useState<Product | null>(null);
  // const [products, setProducts] = useState<Product[] | null>(null);
  // const [itemImages, setItemImages] = useState<Image[] | null>(null);
  // const [images, setImages] = useState<Image[] | null>(null);
  // const [showAll, setShowAll] = useState(false);
  const relatedProducts = showAll
    ? products || []
    : products?.slice(0, 5) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productApi.getById(id);
        console.log(data.data.product_id);
        const imagesRes = await imageApi.getById(data.data.product_id);
        setProduct(data.data);
        setImages(imagesRes.data || []);
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    };
    if (id) fetchData();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.getAll();
      const productWithImages = await Promise.all(
        response.data.map(async (prod: any) => {
          try {
            const imgRes = await imageApi.getById(prod.product_id);
            return {
              ...prod,
              image: imgRes.data[0].url,
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
      console.log({ productWithImages });
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  if (!product) {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        Đang tải sản phẩm...
      </Typography>
    );
  }
  console.log({ products });
  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 5, gap: 3 }}>
      <Box>
        <ProductBanner product={product} image={images || undefined} />
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
            {relatedProducts?.map((prod) => (
              <ProductCart
                key={prod.product_id}
                product={prod}
                image={prod.image}
              />
            ))}
          </Box>
        </Box>

        {products && products.length > 5 && (
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
    </Box>
  );
}