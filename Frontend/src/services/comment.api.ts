import ApiClient from "./axios";

class CommentApi extends ApiClient {
  constructor() {
    super("/comment");
  }

  // Lấy tất cả comment của 1 sản phẩm theo product_id
async getAllById(
  product_id: string | number,
  params: { page?: number; limit?: number } = {}
) {
  try {
    const response = await this.api.get(`/${product_id}`, { params });
    return response.data; // backend trả về { data, total, totalPages, currentPage }
  } catch (error: any) {
    throw new Error(
      `Lấy comment của sản phẩm thất bại: ${error.response?.data?.message || error.message}`
    );
  }
}


  // Tạo comment cho 1 sản phẩm
  async createById(product_id: string | number, data: any) {
    try {
      const response = await this.api.post(`/${product_id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Tạo comment thất bại: ${error.response?.data?.message || error.message}`
      );
    }
  }
}

export default new CommentApi();
