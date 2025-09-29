import { useState } from "react";
import { Button } from "@mui/material";

export default function FilterProduct() {
  const [price, setPrice] = useState(0);

  return (
    <div className="flex-1 w-fit h-fit border border-gray-300 rounded-2xl bg-white shadow-md p-4">
      <div className="m-2 space-y-4">
        <div>
          <p className="font-medium text-gray-700 mb-1">Thương hiệu</p>
          <select className="w-full border rounded-lg px-2 py-1 focus:outline-none">
            <option>Chọn thương hiệu</option>
            <option>Yamaha</option>
            <option>Honda</option>
          </select>
        </div>
        <div>
          <p className="font-medium text-gray-700 mb-1">
            <span>Giá trị : {price.toLocaleString("vi-VN")} đ</span>
          </p>
          <input
            type="range"
            min="0"
            max="20000000"
            step="100000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <p className="mt-2 text-sm text-gray-600"></p>
        </div>
        <Button color="success">Tìm kiếm</Button>
      </div>
    </div>
  );
}
