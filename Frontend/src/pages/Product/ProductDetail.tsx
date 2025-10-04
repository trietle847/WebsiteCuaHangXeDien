import { useParams } from "react-router-dom";
import { Typography, Box} from "@mui/material";
import { useEffect, useState } from "react";
import type { Product } from "../../services/product.api";
import productApi from "../../services/product.api";
import imageApi from "../../services/image.api";
import type { Image } from "../../services/image.api";
import ProductCart from "../../components/Product/ProductCart";
import ProductBanner from "../../components/Product/ProductBanner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [image, setImage] = useState<Image | null>(null);
  const [showAll, setShowAll] = useState(false);

  const relatedProducts = showAll ? products : products?.slice(0, 5) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productApi.get(Number(id));
        setProduct(data.product);

        const allProducts = await productApi.getAll();
        setProducts(
          allProducts.products.filter((p) => p.product_id !== Number(id))
        );

        const imagesRes = await imageApi.getAll();
        const productImg = imagesRes.images.find(
          (img) => img.product_id === Number(id)
        );
        setImage(productImg || null);
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
      <Box>
        <ProductBanner product={product} image={image || undefined} />
      </Box>

      <Box mt={5}>
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
                image={image ?? undefined}
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
