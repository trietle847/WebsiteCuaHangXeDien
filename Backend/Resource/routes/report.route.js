const ReportController = require('../controllers/report.controller');
const router = require('express').Router();
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

router.get('/monthly', authMiddleware, authorizeRoles("admin"), ReportController.getMonthStatistic);
router.get('/annual', authMiddleware, authorizeRoles("admin"), ReportController.getAnnualRevenue);
router.get('/product', authMiddleware, authorizeRoles("admin"), ReportController.getProductStatistic);
router.get('/product/table', authMiddleware, authorizeRoles("admin"), ReportController.getProductReportTable);
router.get('/user', authMiddleware, authorizeRoles("admin"), ReportController.getUserStatistic);
router.get('/user/table', authMiddleware, authorizeRoles("admin"), ReportController.getUserReportTable);

module.exports = router;