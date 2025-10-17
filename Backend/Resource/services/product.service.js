const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const ProductModel = require("../models/product.model");
const sequelize = require("sequelize");
const ImageModel = require("../models/image.model");
const ProductDetailModel = require("../models/productDetail.model");
const ProductColorModel = require("../models/productColor.model");
const ColorModel = require("../models/color.model");

class ProductService {
  // async createProduct(data, files) {
  //   const product = await ProductModel.create(data);

  //   if (files) {
  //     const images = files.map((file) => ({
  //       title: file.originalname,
  //       url: `/uploads/${file.filename}`,
  //       product_id: product.product_id,
  //     }));

  //     await ImageModel.bulkCreate(images);
  //   }

  //   const result = await ProductModel.findByPk(product.product_id, {
  //     include: [{ model: ImageModel, as: "images" }],
  //   });
  //   return result;
  // }

  async createProduct(data, files) {
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
      const mergedData = specsData.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      console.log(mergedData);
      mergedData.product_id = product.product_id;

      await ProductDetailModel.create(mergedData);
    }

    if (colors) {
      const colorList = JSON.parse(colors);

      for (const c of colorList) {
        console.log("tạo thông tin màu của sp");
        console.log(c.color_id);
        console.log(product.product_id);
        const productColor = await ProductColorModel.create({
          product_id: product.product_id,
          color_id: c.color_id,
        });
        console.log(productColor);
        const colorImages = files.filter(
          (f) => f.fieldname === `images_${c.color_id}[]`
        );
        for (const file of colorImages) {
          await ImageModel.create({
            title: file.originalname,
            productColor_id: productColor.productColor_id,
            url: `/uploads/${file.filename}`,
          });
        }
      }
    }

    const fullProduct = await ProductModel.findOne({
      where: { product_id: product.product_id },
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
            },
          ],
        },
      ],
    });

    return fullProduct;
  }

  async deleteProduct(productId) {
    const product = await ProductModel.findByPk(productId);

    if (!product) throw new Error("Không tồn tại sản phẩm này");

    const images = await ImageModel.findAll({
      where: { product_id: productId },
    });
    for (const img of images) {
      const filePath = path.resolve(
        __dirname,
        "../../",
        img.url.replace(/^\//, "")
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Lỗi xóa file ảnh ${filePath}:`, err.message);
        }
      }
    }
    //  xóa sp => tự xóa ảnh của sản phẩm đó trong csdl

    await product.destroy();

    return {
      message: "Xóa sản phẩm thành công",
    };
  }

  async updateProduct(productId, data, files) {
    const product = await ProductModel.findByPk(productId, {
      include: [{ model: ImageModel, as: "images" }],
    });

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    let deleteIds = [];
    if (data.deleteImageIds) {
      try {
        data.deleteImageIds.forEach((id) => {
          deleteIds.push(parseInt(id, 10));
        });
      } catch (err) {
        console.error("Lỗi parse deleteImageIds:", err.message);
        deleteIds = [];
      }
    }

    // Loại bỏ deleteImageIds khỏi data trước khi update
    const { deleteImageIds, ...updateData } = data;
    await product.update(updateData);

    // Xóa ảnh nếu có deleteIds
    if (deleteIds.length > 0) {
      // Query trực tiếp các ảnh cần xóa (tối ưu hơn)
      const imageDeletes = await ImageModel.findAll({
        where: {
          product_id: productId,
          image_id: { [Op.in]: deleteIds },
        },
      });

      // Xóa file vật lý và trong CSDL
      for (const img of imageDeletes) {
        const filePath = path.resolve(
          __dirname,
          "../../",
          img.url.replace(/^\//, "")
        );
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error(`Lỗi xóa file ảnh ${filePath}:`, err.message);
          }
        }
        await img.destroy();
      }
    }

    // Thêm ảnh mới nếu có
    if (files && files.length > 0) {
      const newImages = files.map((file) => ({
        title: file.originalname,
        url: `/uploads/${file.filename}`,
        product_id: product.product_id,
      }));

      await ImageModel.bulkCreate(newImages);
    }

    // Lấy product đã update với images mới
    const updated = await ProductModel.findByPk(productId, {
      include: [{ model: ImageModel, as: "images" }],
    });

    return updated;
  }

  async getProductById(productId) {
    // const product = await ProductModel.findByPk(productId, {
    //   include: [{ model: ImageModel, as: "images" }],
    // });
    // return product;

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
