const MaintenanceScheduleModel = require("../models/maintenanceSchedule.model");
const UserModel = require("../models/user.model");
const ProductModel = require("../models/product.model");
const ProductColorModel = require("../models/productColor.model");
const CompanyModel = require("../models/company.model");
const OrderModel = require("../models/order.model");
const OrderDetailModel = require("../models/orderDetail.model");
const { sendMail } = require("../utils/mail");

class MaintenanceService {
  // Tạo lịch bảo dưỡng dựa trên chính sách bảo dưỡng của sản phẩm
  async createScheduleByPolicy(order_id){
    const order = await OrderModel.findByPk(order_id,{
      include: [
        {
          model: OrderDetailModel,
          as: "OrderDetails",
          include: [
            {
              model: ProductColorModel,
              as: "ProductColor",
              include: [
                {
                  model: ProductModel,
                  as: "Product",
                  include: [
                    {
                      model: CompanyModel,
                      as: "Company",
                    },
                  ],
                },
              ],
            },
          ],
        }
      ]
    });
    if(!order){
      throw new Error("Không tìm thấy đơn hàng");
    }
    
  }

  async createSchedule(data) {
    const schedule = await MaintenanceScheduleModel.create(data);
    return schedule;
  }

  async sendReminder(data) {
    try {
      const user = await UserModel.findByPk(data.user_id);
      if (!user) throw new Error("Không tìm thấy user");
      if (!user.email) throw new Error("User chưa có email hợp lệ");
      console.log(user.email);
      const email = user.email;
      const mail = await sendMail(
        email,
        "Nhắc nhở lịch bảo trì xe định kỳ.",
        "Xin chào, bạn có lịch bảo trì xe. Vui lòng sắp xếp thời gian tham gia."
      );
      return mail;
    } catch (error) {
      console.error("Gửi mail thất bại:", error);
    }
  }
}

module.exports = new MaintenanceService();
