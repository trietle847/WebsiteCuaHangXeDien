const ReportController = require('../controllers/report.controller');
const router = require('express').Router();

router.get('/monthly', ReportController.getMonthStatistic);
router.get('/annual', ReportController.getAnnualRevenue);

module.exports = router;