import ApiClient from "./axios";

class ReportApi extends ApiClient {
  constructor() {
    super("/report");
  }

  async getMonthStatistic(monthYear: string | null) {
    try {
      return (
        await this.api.get(`/monthly`, {
          params: monthYear ? { monthYear } : {},
        })
      ).data;
    } catch (error) {
      throw new Error(`Lỗi khi lấy báo cáo tháng: ${error}`);
    }
  }

  async getAnnualRevenue(year: number | null) {
    try {
      return (
        await this.api.get(`/annual`, {
          params: year ? { year } : {},
        })
      ).data;
    } catch (error) {
      throw new Error(`Lỗi khi lấy báo cáo năm: ${error}`);
    }
  }

  async getProductStatistic(monthYear: string | null) {
    try {
      const params: any = {};
      if (monthYear) {
        params.monthYear = monthYear;
      }
      return (await this.api.get(`/product`, { params })).data;
    } catch (error) {
      throw new Error(`Lỗi khi lấy báo cáo sản phẩm: ${error}`);
    }
  }
}

export default new ReportApi();
