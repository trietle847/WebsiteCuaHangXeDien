const { Op } = require("sequelize");
const ProductModel = require("../models/product.model");
const sequelize = require("sequelize");
const ImageModel = require("../models/image.model");
const ProductDetailModel = require("../models/productDetail.model");
const ProductColorModel = require("../models/productColor.model");
const ColorModel = require("../models/color.model");
const ProductColorService = require("./productColor.service");
const CompanyModel = require("../models/company.model");
const ImageService = require("./image.service");
const RatingModel = require("../models/rating.model");

class ProductService {
  async createProduct(data, files) {
    //Cơ chế đảm bảo an toàn dữ liệu của sequelize
    const transaction = await ProductModel.sequelize.transaction();

    try {
      const {
        name,
        price,
        description,
        company_id,
        maintenance_policy,
        warranty_policy,
        specs,
        colors,
        newQuantities,
      } = data;

      let policy = null;
      const company = await CompanyModel.findByPk(company_id);
      if(!company){
        throw new Error("Không tìm thấy hãng xe");
      }
      maintenance = JSON.parse(maintenance_policy) || company.maintenance_policy;
      warranty = JSON.parse(warranty_policy) || company.warranty_policy;

      const product = await ProductModel.create({
        name,
        price,
        description,
        company_id,
        average_rating: 0,
        maintenance_policy: maintenance,
        warranty_policy: warranty,
      });

      if (specs) {
        const specsData = JSON.parse(specs);
        specsData.product_id = product.product_id;
        await ProductDetailModel.create(specsData);
      }

      if (colors) {
        const colorIds = JSON.parse(colors);
        // Tạo ProductColor
        const productColors = await ProductColorService.createProductColors(
          colorIds,
          product.product_id,
          JSON.parse(newQuantities),
          transaction
        );

        // Thêm ảnh cho ProductColor nếu có
        await ProductColorService.addImagesToProductColors(
          productColors.map((pc) => pc.productColor_id),
          files,
          transaction
        );
      }

      // Kết thúc quá trình
      await transaction.commit();

      const fullProduct = await this.getProductById(product.product_id);

      return fullProduct;
    } catch (error) {
      console.error("Lỗi tạo sản phẩm:", error.message);
      // Phục hồi lại nếu có lỗi
      await transaction.rollback();
      throw error;
    }
  }

  async deleteProduct(productId) {
    const transaction = await ProductModel.sequelize.transaction();

    try {
      const product = await ProductModel.findByPk(productId);

      if (!product) throw new Error("Không tồn tại sản phẩm này");

      //Tìm các id của productColor thuộc product cần xóa
      const productColorIds = await ProductColorModel.findAll({
        where: { product_id: productId },
        attributes: ["productColor_id"],
        raw: true,
        transaction,
      }).then((pcs) => pcs.map((pc) => pc.productColor_id));

      let deleteResult = { filesDeleted: 0, recordsDeleted: 0 };

      if (productColorIds.length > 0) {
        //Tìm các ảnh thuộc productColor trên để xóa trong local
        const images = await ImageModel.findAll({
          where: { productColor_id: { [Op.in]: productColorIds } },
          transaction,
        });

        //Gọi hàm xóa ảnh của productColor service
        deleteResult = await ImageService.deleteImages(images, transaction);
      }

      /* Do đổi thành on delete cascade trong association nên
      xóa product -> xóa bảng ghi productColor + productDetail
      */
      await product.destroy({ transaction });
      await transaction.commit();
      return {
        message: "Xóa sản phẩm thành công",
        ...deleteResult,
      };
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw error;
    }
  }

  async updateProduct(productId, data, files) {
    const transaction = await ProductModel.sequelize.transaction();

    try {
      const product = await ProductModel.findByPk(productId, {
        include: {
          model: ProductDetailModel,
          as: "ProductDetail",
        },
        transaction,
      });

      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      const {
        colors,
        addImgPCIds, // Id của các productColor hiện tại mà người dùng đã thêm ảnh mới
        deleteProductColorIds,
        deleteImageIds,
        specs,
        newQuantities,
        updateQuantities,
        maintenance_policy,
        warranty_policy,
        ...updateData
      } = data;

      // Xóa các productColor mà người dùng chọn xác nhận xóa khỏi sản phẩm nếu có
      if (deleteProductColorIds) {
        await ProductColorService.deleteProductColors(
          JSON.parse(deleteProductColorIds),
          transaction
        );
      }

      // Xóa các hình ảnh người dùng xác nhận xóa khỏi sản phẩm
      if (deleteImageIds) {
        const deleteImages = await ImageModel.findAll({
          where: {
            image_id: { [Op.in]: JSON.parse(deleteImageIds) },
          },
          transaction,
        });
        await ImageService.deleteImages(deleteImages, transaction);
      }

      // Cập nhật thông số kỹ thuật
      if (specs) {
        // Phòng trường hợp đã tạo product nhưng chưa có detail
        // nên ta phải include ProductDetail khi kiểm tra product
        if (product.ProductDetail) {
          const productDetail = await ProductDetailModel.findOne({
            where: {
              productDetail_id: product.ProductDetail.productDetail_id,
            },
            transaction,
          });
          await productDetail.update(JSON.parse(specs), { transaction });
        } else {
          // Tạo mới nếu chưa có
          const specsData = JSON.parse(specs);
          specsData.product_id = product.product_id;
          await ProductDetailModel.create(specsData, { transaction });
        }
      }

      // Cập nhật thông tin cơ bản
      // const company = await CompanyModel.findByPk(updateData.company_id);
      // if(!company){
      //   throw new Error("Không tìm thấy hãng xe");
      // }
      // maintenance = JSON.parse(maintenance_policy) || company.maintenance_policy;
      // warranty = JSON.parse(warranty_policy) || company.warranty_policy;
      await product.update({
        ...updateData,
        // maintenance_policy: maintenance,
        // warranty_policy: warranty,
      }, { transaction });

      /* Khởi tạo productColorIds với id của
      productColor hiện tại đc thêm ảnh mới
      */
      const productColorIds = [];
      if (addImgPCIds) productColorIds.push(...JSON.parse(addImgPCIds));
      if (colors) {
        //Thêm màu mới cho sản phẩm
        const newProductColors = await ProductColorService.createProductColors(
          JSON.parse(colors),
          productId,
          JSON.parse(newQuantities),
          transaction
        );
        // Kết hợp với productColor mới
        productColorIds.push(
          ...newProductColors.map((pc) => pc.productColor_id)
        );
      }
      // Cập nhật số lượng của productColor cũ nếu có
      if (updateQuantities) {
        await ProductColorService.updateQuantities(
          JSON.parse(updateQuantities),
          transaction
        );
      }

      // Thêm ảnh mới nếu có
      if (files && files.length > 0 && productColorIds.length > 0) {
        await ProductColorService.addImagesToProductColors(
          productColorIds,
          files,
          transaction
        );
      }

      // Lấy product đã update với images mới
      const updated = await this.getProductById(productId);
      await transaction.commit();
      return updated;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getProductById(productId) {
    await this.updateAverageRating(productId);
    const fullProduct = await ProductModel.findOne({
      where: { product_id: productId },
      include: [
        {
          model: ProductDetailModel,
          as: "ProductDetail",
        },
        {
          model: ProductColorModel,
          as: "ProductColors",
          include: [
            {
              model: ImageModel,
              as: "ColorImages",
            },
            {
              model: ColorModel,
              as: "Color",
            },
          ],
        },
      ],
    });

    return fullProduct;
  }

  async getAllProduct(query) {
    const {
      keyword = "",
      page = 1,
      limit = 10,
      company_id,
      color_id,
      maxPrice,
      average_rating,
      sortBy = "price",
      sortOrder = "asc",
    } = query;

    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 1, 1);
    const offset = (validPage - 1) * validLimit;

    // --- Điều kiện filter sản phẩm ---
    const productWhere = {};
    if (keyword) productWhere.name = { [Op.like]: `%${keyword}%` };
    if (company_id) productWhere.company_id = Number(company_id);
    if (maxPrice) productWhere.price = { [Op.lte]: Number(maxPrice) };
    if (average_rating)
      productWhere.average_rating = { [Op.lte]: Number(average_rating) };

    // --- Include ProductColors + Color + Image ---
    const productColorInclude = {
      model: ProductColorModel,
      as: "ProductColors",
      include: [
        {
          model: ColorModel,
          as: "Color",
        },
        {
          model: ImageModel,
          as: "ColorImages",
        },
      ],
    };

    // Nếu filter theo color_id
    if (color_id) {
      const colorIds = color_id.split(",").map(Number);
      productColorInclude.where = { color_id: { [Op.in]: colorIds } };
    }

    // --- Sắp xếp ---
    const order = [];
    if (sortBy === "price" || sortBy === "average_rating") {
      order.push([sortBy, sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC"]);
    }

    // --- Query sản phẩm ---
    const { count, rows } = await ProductModel.findAndCountAll({
      where: productWhere,
      distinct: true, // quan trọng để count đúng khi include nhiều bảng
      offset,
      limit: validLimit,
      include: [
        productColorInclude,
        {
          model: ProductDetailModel,
          as: "ProductDetail",
        },
        {
          model: CompanyModel,
          as: "Company",
          attributes: ["company_id", "name"],
        },
      ],
      order,
    });

    // Cập nhật lại điểm đánh giá trung bình cho từng product
    for (const product of rows) {
      await this.updateAverageRating(product.product_id);
    }

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / validLimit),
    };
  }

  async findProductByName(name) {
    const products = await ProductModel.findAll({
      where: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
        [Op.like]: `%${name.toLowerCase()}%`,
      }),
    });
    return products;
  }

  async search(keyword = "", page = 1, limit = 15) {
    const offset = (page - 1) * limit;

    const { count, rows } = await ProductModel.findAndCountAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }],
      },
      offset,
      limit,
    });
    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  async updateAverageRating(productId) {
    const ratings = await RatingModel.findAll({
      where: { product_id: productId },
      attributes: ["stars"],
      raw: true,
    });

    if (!ratings || ratings.length === 0) {
      await ProductModel.update(
        { average_rating: 0 },
        { where: { product_id: productId } }
      );
      return 0;
    }

    const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
    const avg = sum / ratings.length;

    await ProductModel.update(
      { average_rating: avg.toFixed(1) },
      { where: { product_id: productId } }
    );

    return avg;
  }
}

module.exports = new ProductService();
