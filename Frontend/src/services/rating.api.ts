import ApiClient from "./axios";

class RatingApi extends ApiClient {
  constructor() {
    super("/rating");
  }

  // Lấy tất cả comment của 1 sản phẩm theo product_id
async getAllByProductId(product_id: any, params = {}) {
    try {
      const response = await this.api.get("/", {
        params: { product_id, ...params },
      });
      return response.data; // backend trả về { data, total, totalPages, currentPage }
    } catch (error:any) {
      throw new Error(
        `Lấy rating của sản phẩm thất bại: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async createRating(product_id: any, data: any) {
    try {
      const response = await this.api.post(`/product/${product_id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Thêm rating thất bại: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
  
  async checkPurchased(product_id: any) {
    try {
      const response = await this.api.get(`/check-purchased/${product_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Thêm rating thất bại: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async getMyRating(product_id: any) {
    try {
      const response = await this.api.get(`/myRating/${product_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lấy rating thất bại: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}



export default new RatingApi();
