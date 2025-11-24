import ApiClient from "./axios";

class ServiceTicketApi extends ApiClient {
  constructor() {
    super("/service-ticket");
  }

  async getServiceTicketByCustomer() {
    try {
      const response = await this.api.get("/customer");
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lỗi khi lấy phiếu dịch vụ của khách hàng: ${error.data.response.message}`
      );
    }
  }

  async getScheduleSlots(date: string) {
    try {
      const response = await this.api.get("/schedule",{
        params: { date },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lỗi khi lấy lịch bảo trì: ${error.data.response.message}`
      );
    }
  }
}

export default new ServiceTicketApi();
