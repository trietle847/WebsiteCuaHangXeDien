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
              `Tạo đơn hàng thất bại: ${error.response.data.message}`
            );
        }
    }
}

export default new OrderApi();
