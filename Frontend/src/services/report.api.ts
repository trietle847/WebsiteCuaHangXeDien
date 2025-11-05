import ApiClient from "./axios";

class ReportApi extends ApiClient {
  constructor() {
    super("/report");
  }

  async getMonthStatistic(monthYear: string) {
    return (await this.api.get(`/${monthYear}`)).data;
  }
}

export default new ReportApi();
