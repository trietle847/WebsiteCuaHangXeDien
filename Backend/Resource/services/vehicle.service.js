const Vehicle = require("../models/vehicle.model");

function generateIdentifier(product_id,color_id,index_i,index_j) {
    const timestamp = Date.now(); // Dùng timestamp để đảm bảo tính duy nhất
    const vin = `${product_id}${color_id}VIN${timestamp}${index_i}${index_j}`;
    const engine_number = `${product_id}${color_id}ENG${timestamp}${index_i}${index_j}`;
    return { vin, engine_number };
}

class VehicleService {
    async createVehicles(order, user_id ) {
        const vehiclesToCreate = order.OrderDetails.map((orderDetail,i) => {
            const productColor = orderDetail.ProductColor;
            const product_id = productColor.product_id;
            const color_id = productColor.color_id;
            for (let j = 0; j < orderDetail.quantity; j++) {
                const { vin, engine_number } = generateIdentifier(product_id, color_id, i, j);
                return {
                    vin,
                    engine_number,
                    status: "sold",
                    productColor_id: productColor.product_color_id,
                    user_id: user_id,
                    order_id: order.order_id,
                };
            }
        })

        const vehicles = await Vehicle.bulkCreate(vehiclesToCreate);
        return vehicles;
    }
}

module.exports = new VehicleService();