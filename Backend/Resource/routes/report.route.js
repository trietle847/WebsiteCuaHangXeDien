const ReportController = require('../controllers/report.controller');
const router = require('express').Router();

router.get('/monthly', ReportController.getMonthStatistic);
router.get('/annual', ReportController.getAnnualRevenue);
router.get('/product', ReportController.getProductStatistic);
router.get('/product/table', ReportController.getProductReportTable);

module.exports = router;