const CompanyController = require("../controllers/company.controller");
const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

router.get("/", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompanyById);
router.post("/", authMiddleware, authorizeRoles("staff"), CompanyController.createCompany);
router.put("/:id", authMiddleware, authorizeRoles("staff"), CompanyController.updateCompany);
router.delete("/:id", authMiddleware, authorizeRoles("staff"), CompanyController.deleteCompany);

module.exports = router;