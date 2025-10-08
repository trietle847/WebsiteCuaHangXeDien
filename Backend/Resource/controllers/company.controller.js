const CompanyService = require("../services/company.service");

class CompanyController {
  async getAllCompanies(req, res) {
    try {
      const companies = await CompanyService.getAllCompanies();
      res.json({data: companies});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getCompanyById(req, res) {
    try {
      const { id } = req.params;
      const company = await CompanyService.getCompanyById(id);
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createCompany(req, res) {
    try {
      const data = req.body;
      const files = req.files;
      const company = await CompanyService.createCompany(data, files);
      res.status(201).json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateCompany(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const company = await CompanyService.updateCompany(id, data);
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCompany(req, res) {
    try {
      const { id } = req.params;
      await CompanyService.deleteCompany(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new CompanyController();
