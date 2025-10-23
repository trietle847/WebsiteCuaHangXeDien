import ApiClient from "./axios";


class CompanyApi extends ApiClient {
  constructor() {
    super("/company");
  }


  
}

export default new CompanyApi();
