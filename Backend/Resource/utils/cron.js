const cron = require("node-cron")
const { findUpcomingMaintenances } = require("./cron-task")

cron.schedule("0 8 * * *", async () => {
    await findUpcomingMaintenances();
})