const { Op } = require("sequelize");

class BaseService {
  constructor(model, name, includes = []) {
    this.model = model;
    this.name = name;
    this.includes = includes;
  }

  async getAll(query = {}) {
    // Nếu không có query, lấy tất cả
    if (Object.keys(query).length === 0) {
      const items = await this.model.findAll({ include: this.includes });
      return { data: items };
    }

    // Xử lý phân trang và search
    const { page: pageQuery, limit: limitQuery, ...restQuery } = query;
    const where = {};
    const searchKeys = Object.keys(restQuery);

    if (searchKeys.length > 0) {
      where[Op.or] = searchKeys.map((key) => ({
        [key]: { [Op.like]: `%${restQuery[key]}%` },
      }));
    }

    const page = pageQuery ? parseInt(pageQuery, 10) : 1;
    const limit = limitQuery ? parseInt(limitQuery, 10) : 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.model.findAndCountAll({
      where,
      include: this.includes,
      limit,
      offset,
      distinct: true,
    });

    return {
      total: count,
      page,
      limit,
      data: rows,
    };
  }

  async getById(id) {
    const item = await this.model.findByPk(id, {
      include: this.includes,
    });
    if (!item) {
      throw new Error(`${this.name} không tìm thấy`);
    }
    return item;
  }

  async create(data) {
    const newItem = await this.model.create(data);
    return newItem;
  }

  async update(id, data) {
    const [updatedRows] = await this.model.update(data, {
      where: { id },
    });

    if (updatedRows === 0) {
      throw new Error(`${this.name} không tìm thấy`);
    }

    const updatedItem = await this.model.findByPk(id, {
      include: this.includes,
    });
    return updatedItem;
  }

  async delete(id) {
    const deletedRows = await this.model.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      throw new Error(`${this.name} không tìm thấy`);
    }

    return { message: `Xóa ${this.name} thành công` };
  }
}

module.exports = BaseService;
