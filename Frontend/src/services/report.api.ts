import ApiClient from "./axios";

class ReportApi extends ApiClient {
  constructor() {
    super("/report");
  }

  async getMonthStatistic(monthYear: string | null) {
    return (await this.api.get(`/monthly`,{
      params: monthYear ? { monthYear } : {}
    })).data;
  }
}

export default new ReportApi();
