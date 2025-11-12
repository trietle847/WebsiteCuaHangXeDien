import ApiClient from "./axios";

class OrderApi extends ApiClient {
  constructor() {
    super("/order");
  }

  async createByStaff(data: any) {
    try {
      const response = await this.api.post("/staff", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Tạo đơn hàng thất bại: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async getByUser(params?: { status?: string; page?: number; limit?: number }) {
    try {
      const response = await this.api.get("/user/me", { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lấy đơn hàng của người dùng thất bại: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async getOrderByIdAndUser(id: number | string) {
    try {
      const response = await this.api.get(`/user/me/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lấy đơn hàng theo ID thất bại: ${error.response?.data?.message || error.message}`
      );
    }
  }
}

export default new OrderApi();
