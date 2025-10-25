const RepairScheduleModel = require("../models/repairSchedule.model");
const { Op } = require("sequelize");

class RepairService {
  async createRepairSchedule(data) {
    const repair = await RepairScheduleModel.create(data);
    return repair;
  }
}

module.exports = new RepairService();
