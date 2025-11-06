const ReportController = require('../controllers/report.controller');
const router = require('express').Router();

router.get('/monthly', ReportController.getMonthStatistic);

module.exports = router;