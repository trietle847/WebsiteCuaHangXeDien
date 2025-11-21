import ApiClient from "./axios";

class VehicleApi extends ApiClient {
  constructor() {
    super("/vehicle");
  }

  async getVehicleByCustomer() {
    try {
      const response = await this.api.get("/customer");
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lỗi khi lấy dữ liệu xe của khách hàng: ${error.response.data.message}`
      );
    }
  }

  async findVehicleForCustomer(customer_id: string) {
    try {
      const response = await this.api.get(`/customer/${customer_id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lỗi khi tìm xe cho khách hàng: ${error.response.data.message}`
      );
    }
  }
}

export default new VehicleApi();