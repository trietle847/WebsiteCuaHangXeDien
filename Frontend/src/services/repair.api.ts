import ApiClient from "./axios";

class RepairApi extends ApiClient {
  constructor() {
    super("/repair");
  }
  async getTimeRepairOfMechanic(mechanicId: string, repairDate: string) {
    return (await this.api.get("/schedule",{
      params: {
        mechanic_id: mechanicId,
        repair_date: repairDate
      }
    })).data;
  }
}

export default new RepairApi();
