import ApiClient from "./axios";

class MaintenanceApi extends ApiClient {
  constructor() {
    super("/maintenance");
  }
}

export default new MaintenanceApi();