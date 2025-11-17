import ApiClient from "./axios";

class ServiceTicketApi extends ApiClient {
  constructor() {
    super("/service-ticket");
  }

  async getScheduleSlots() {
    try {
      const response = await this.api.get("/schedule");
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Lỗi khi lấy lịch bảo trì: ${error.data.response.message}`
      );
    }
  }
}

export default new ServiceTicketApi();
