const Vehicle = require("../models/vehicle.model");
const ProductColor = require("../models/productColor.model");
const Product = require("../models/product.model");
const Color = require("../models/color.model");
const serviceTicketService = require("./serviceTicket.service");

function generateIdentifier(product_id, color_id, index_i, index_j) {
  const timestamp = Date.now(); // Dùng timestamp để đảm bảo tính duy nhất
  const vin = `${product_id}${color_id}VIN${timestamp}${index_i}${index_j}`;
  const engine_number = `${product_id}${color_id}ENG${timestamp}${index_i}${index_j}`;
  return { vin, engine_number };
}

class VehicleService {
  async createVehicles(order, user_id, transaction) {
    // Kiểm tra order có OrderDetails không
    if (!order.OrderDetails || order.OrderDetails.length === 0) {
      console.error("Order không có OrderDetails:", order.order_id);
      return [];
    }

    // Dùng .flatMap để duyệt qua các detail VÀ số lượng của chúng
    const vehiclesToCreate = order.OrderDetails.flatMap((orderDetail, i) => {
      // mảng tạm cho các xe của 1 orderDetail
      const vehiclesInDetail = [];

      const productColor = orderDetail.ProductColor;
      if (!productColor) {
        console.error(
          `OrderDetail ${orderDetail.orderDetail_id} không có ProductColor, bỏ qua`
        );
        return []; // Bỏ qua nếu thiếu dữ liệu
      }

      // Kiểm tra Product có tồn tại không (cần cho createTicketByPolicy)
      if (!productColor.Product) {
        console.error(
          `ProductColor ${productColor.productColor_id} không có Product, bỏ qua`
        );
        return [];
      }

      const product_id = productColor.product_id;
      const color_id = productColor.color_id;

      // Lặp qua số lượng
      for (let j = 0; j < orderDetail.quantity; j++) {
        const { vin, engine_number } = generateIdentifier(
          product_id,
          color_id,
          i,
          j
        );

        // Thêm xe vào mảng tạm
        vehiclesInDetail.push({
          vin,
          engine_number,
          status: "sold",
          productColor_id: productColor.productColor_id,
          user_id: user_id,
          order_id: order.order_id,
          maintenance_policy: productColor.Product.maintenance_policy,
          warranty_policy: productColor.Product.warranty_policy,
        });
      }

      // Trả về mảng xe (flatMap sẽ tự động "làm phẳng" nó)
      return vehiclesInDetail;
    });

    // 1. Bulk create TẤT CẢ các xe
    const vehicles = await Vehicle.bulkCreate(vehiclesToCreate, { transaction });

    // 2. Bulk create lịch bảo trì cho từng xe
    const ticketPromises = vehicles.map((vehicle) =>
      serviceTicketService.createTicketByPolicy(
        vehicle.vehicle_id,
        transaction
      )
    );
    await Promise.all(ticketPromises);

    return vehicles;
  }

  async getVehicleByUserId(user_id) {
    const vehicles = await Vehicle.findAll({
      where: { user_id },
      include: [
        {
          model: ProductColor,
          as: "ProductColor",
          include: [
            {
              model: Product,
              as: "Product",
            },
            {
              model: Color,
              as: "Color",
            },
          ],
        },
      ],
    });
    return vehicles;
  }
}

module.exports = new VehicleService();
