const ReportController = require('../controllers/report.controller');
const router = require('express').Router();

router.get('/:monthYear', ReportController.getMonthStatistic);

module.exports = router;