import ApiClient from "./axios";

class RepairApi extends ApiClient {
  constructor() {
    super("/repair");
  }
  async getTimeRepair(repairDate: string) {
    return (await this.api.get("/schedule",{
      params: {
        repair_date: repairDate
      }
    })).data;
  }
}

export default new RepairApi();
