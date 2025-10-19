const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const ProductModel = require("../models/product.model");
const sequelize = require("sequelize");
const ImageModel = require("../models/image.model");
const ProductDetailModel = require("../models/productDetail.model");
const ProductColorModel = require("../models/productColor.model");
const ColorModel = require("../models/color.model");
const ProductColorService = require("./productColor.service");
const productColorService = require("./productColor.service");
const CompanyModel = require("../models/company.model");

class ProductService {
  async createProduct(data, files) {
    //Cơ chế đảm bảo an toàn dữ liệu của sequelize
    const transaction = await ProductModel.sequelize.transaction();

    try {
      const { name, price, stock_quantity, company_id, specs, colors } = data;
      const product = await ProductModel.create({
        name,
        price,
        stock_quantity,
        company_id,
        average_rating: 0,
      });

      if (specs) {
        const specsData = JSON.parse(specs);
        console.log("specsData:", specsData);
        specsData.product_id = product.product_id;
        await ProductDetailModel.create(specsData);
        console.log("Tạo thông tin chi tiết sản phẩm thành công");
      }

      if (colors) {
        const colorIds = JSON.parse(colors);
        // Tạo ProductColor
        const productColors = await ProductColorService.createProductColors(
          colorIds,
          product.product_id
        );

        // Thêm ảnh cho ProductColor nếu có
        await ProductColorService.addImagesToProductColors(
          productColors.map((pc) => pc.productColor_id),
          files
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
        deleteResult = productColorService.deleteImages(images, transaction);
      }

      /* Do đổi thành on delete cascade trong association nên
      xóa product -> xóa bảng ghi productColor + productDetail
      */
      await product.destroy({ transaction });
      transaction.commit()
      return {
        message: "Xóa sản phẩm thành công",
        deleteResult,
      };
    } catch (error) {
      console.log(error)
      await transaction.rollback();
      throw error;
    }
  }

  async updateProduct(productId, data, files) {
    const transaction = await ProductModel.sequelize.transaction();

    try {
      const product = await ProductModel.findByPk(productId, {
        include: [{ model: ImageModel, as: "images" }],
      });

      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      const {
        colors,
        deleteProductColorIds,
        deleteImageIds,
        specs,
        ...updateData
      } = data;

      // Xóa các productColor mà người dùng chọn xác nhận xóa khỏi sản phẩm nếu có
      const result = {};
      if (deleteProductColorIds) {
        const deletePCRes = await productColorService.deleteProductColors(
          deleteProductColorIds
        );
        result = { ...deletePCRes };
      }

      // Xóa các hình ảnh người dùng xác nhận xóa khỏi sản phẩm
      if (deleteImageIds) {
        const deleteImages = await ImageModel.findAll({
          where: { [Op.in]: deleteImageIds },
          transaction,
        });
        const deleteImageRes = await productColorService.deleteImages(
          deleteImages,
          transaction
        );
        result = { ...result, ...deleteImageRes };
      }

      // Cập nhật thông số kỹ thuật
      const productDetail = await ProductDetailModel.findOne({
        where: {
          product_id: productId,
        },
      });
      productDetail.update(specs);

      // Cập nhật thông tin cơ bản
      await product.update(updateData);

      // Thêm ảnh mới nếu có
      if (files && files.length > 0) {
        const colorIds = JSON.parse(colors);
        const addImagesRes =
          await productColorService.addImagesToProductColors(colorIds,files);
          result={...result,...addImagesRes};
      }

      // Lấy product đã update với images mới
      const updated = await this.getProductById(productId);
      transaction.commit()
      return updated;
    } catch (error) {}
  }

  async getProductById(productId) {
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
          ],
        },
      ],
    });

    return fullProduct;
  }

  async getAllProduct() {
    const products = await ProductModel.findAll({
      include: [
        {
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
        },
        {
          model: ProductDetailModel,
          as: "ProductDetail",
        },
        {
          model: CompanyModel,
          as: "Company",
          attributes: ["company_id","name"]
        }
      ],
    });

    return products;
  }

  async findProductByName(name) {
    const products = await ProductModel.findAll({
      where: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
        [Op.like]: `%${name.toLowerCase()}%`,
      }),
    });
    return products;
  }
}

module.exports = new ProductService();
