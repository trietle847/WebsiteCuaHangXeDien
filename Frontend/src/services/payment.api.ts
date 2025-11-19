import ApiClient from "./axios";

class PaymentApi extends ApiClient {
  constructor() {
    super("/payment");
  }
  async createMomoPayment(id: number | string) {
    try {
      const response = await this.api.post(`/create/momo/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Tạo thanh toán qua momo: ${error}`);
    }
  }

  async handleMomoIPN(payload: any) {
    try {
      const response = await this.api.post("/momo/ipn", payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Lỗi khi thanh toán qua momo: ${error}`);
    }
  }
}

export default new PaymentApi();
