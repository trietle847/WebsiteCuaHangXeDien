const CompanyController = require("../controllers/company.controller");
const express = require("express");
const router = express.Router();

router.get("/", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompanyById);
router.post("/", CompanyController.createCompany);
router.put("/:id", CompanyController.updateCompany);
router.delete("/:id", CompanyController.deleteCompany);

module.exports = router;