const cron = require("node-cron")
const MaintenanceModel = require("../models/maintenanceSchedule.model")
const MaintenanceService = require("../services/maintenance.service")
const { Op } = require("sequelize")

cron.schedule("0 8 * * *", async () => {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1

    const schedules = await MaintenanceModel.findAll({
        where: {
            day_of_month: day,
            status: "pending"
        }
    })

    for (const schedule of schedules) {
        const createMonth = schedule.createdAt.getMonth() + 1
        const gap = (month - createMonth + 12) % 12

        if (gap % schedule.interval_month === 0) {
            await MaintenanceService.sendReminder(schedule)
        }
    }
})