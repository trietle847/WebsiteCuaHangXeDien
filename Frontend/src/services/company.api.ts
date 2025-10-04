import ApiClient from "./axios";

export interface Company {
  company_id: number;
  name: string;
}

class CompanyApi extends ApiClient {
  constructor() {
    super("/company");
  }


  
}

export default new CompanyApi();
