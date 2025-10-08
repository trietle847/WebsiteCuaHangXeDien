const CompanyModel = require("../models/company.model");

class CompanyService {
  async getAllCompanies() {
    const companies = await CompanyModel.findAll();
    return companies;
  }

  async getCompanyById(companyId) {
    const company = await CompanyModel.findByPk(companyId);
    if (!company) throw new Error("Không tồn tại hãng xe này");
    return company;
  }

  async createCompany(data, files) {
    const company = await CompanyModel.create(data);
    return company;
  }

  async updateCompany(companyId, data) {
    const company = await CompanyModel.findByPk(companyId);

    if (!company) {
      throw new Error("Không tìm thấy hãng xe");
    }
    await company.update(data);
    return company;
  }

  async deleteCompany(companyId) {
    const company = await CompanyModel.findByPk(companyId);

    if (!company) {
      throw new Error("Không tìm thấy hãng xe");
    }
    await company.destroy();
    return company;
  }
}

module.exports = new CompanyService();
