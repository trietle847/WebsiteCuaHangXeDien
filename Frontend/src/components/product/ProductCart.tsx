import { Link } from "react-router-dom";
import Rating from "./Rating";

export default function ProductCart() {
  const product = {
    id: "12",
    name: "Xe điện VinFast Evo 200",
    price: 10000000,
    stock_quantity: 12,
    specifications:
      "Pin LFP 3.5kWh, vận tốc tối đa 70 km/h, quãng đường 200 km/lần sạc",
    average_rating: 4.6,
    image:
      "https://media-cdn-v2.laodong.vn/storage/newsportal/2024/9/4/1389245/Xe-Dap-Dien-Dk-Samur.jpg",
  };

  return (
    <Link to={`/products/${product.id}`}>
      <div className="border border-gray-200 rounded-lg relative cursor-pointer transition-transform duration-300 hover:shadow-xl">
        <div>
          <img
            className="w-full h-auto object-cover rounded-lg"
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className="absolute top-0">
          <Rating value={product.average_rating} size="4vw" />
        </div>

        <div className="p-[1vw]">
          <p className="font-semibold text-gray-700 text-[1vw]">
            {product.name}
          </p>
          <p className="text-green-600 font-bold text-[1.2vw]">
            Giá: {product.price.toLocaleString("vi-VN")} ₫
          </p>
          <p className="text-gray-700 text-[0.9vw]">
            Tồn kho: {product.stock_quantity}
          </p>
          <p className="text-gray-700 text-[0.9vw]">{product.specifications}</p>
        </div>
      </div>
    </Link>
  );
}
