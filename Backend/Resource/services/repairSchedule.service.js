const RepairScheduleModel = require("../models/repairSchedule.model");
const { Op, where } = require("sequelize");

class RepairService {
  async createRepairSchedule(data) {
    const repair = await RepairScheduleModel.create(data);
    return repair;
  }

  async getRepairSchedule(userId) {
    const repairs = await RepairScheduleModel.findAll({
      where: { user_id: userId },
    });
    return repairs;
  }

  async getTimeRepairOfMechanic(mechanicId, date) {
    const schedules = await RepairScheduleModel.findAll({
      where: {
        mechanic_id: mechanicId,
        repair_date: date,
      },
      attributes: ["repair_time"],
    });

    const bookedTimes = schedules.map((s) => s.repair_time.slice(0, 5));
    return bookedTimes;
  }
}

module.exports = new RepairService();
