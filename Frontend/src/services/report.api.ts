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

  async getProductReportTable(params: {
    monthYear: string | null;
    keyword?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const queryParams: any = {};
      if (params.monthYear) queryParams.monthYear = params.monthYear;
      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      return (await this.api.get(`/product/table`, { params: queryParams }))
        .data;
    } catch (error) {
      throw new Error(`Lỗi khi lấy bảng báo cáo sản phẩm: ${error}`);
    }
  }

  async getUserStatistic(monthYear: string | null) {
    try {
      const params: any = {};
      if (monthYear) {
        params.monthYear = monthYear;
      }
      return (await this.api.get(`/user`, { params })).data;
    } catch (error) {
      throw new Error(`Lỗi khi lấy báo cáo người dùng: ${error}`);
    }
  }

  async getUserReportTable(params: {
    keyword?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const queryParams: any = {};
      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      return (await this.api.get(`/user/table`, { params: queryParams })).data;
    } catch (error) {
      throw new Error(`Lỗi khi lấy bảng báo cáo người dùng: ${error}`);
    }
  }
}

export default new ReportApi();
