import ApiClient from "./axios";

export interface Company {
  company_id: number;
  name: string;
}

class CompanyApi extends ApiClient {
  constructor() {
    super("/company");
  }

  async getAll(): Promise<Company[]> {
    const response = await this.api.get<Company[]>("/");
    return response.data;
  }

  
}

export default new CompanyApi();
