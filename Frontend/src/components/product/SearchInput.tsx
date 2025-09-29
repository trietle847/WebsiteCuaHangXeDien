import { Button } from "@mui/material";

export default function SearchInput(){
  return (
    <div className="flex gap-2 items-center mb-4">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        className="flex-1 h-10 px-3 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
      />
      <Button
        variant="contained"
        className="h-10 bg-green-500 hover:bg-green-600 text-white px-6"
      >
        Tìm kiếm
      </Button>
    </div>
  );
}