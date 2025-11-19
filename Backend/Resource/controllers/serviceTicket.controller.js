const ServiceTicketService = require("../services/serviceTicket.service");
const ApiError = require("../middlewares/error.middleware");

exports.getServiceTickets = async (req, res, next) => {
  try {
    const tickets = await ServiceTicketService.getAllTickets(req.query);
    res.status(200).json({
      message: "Lấy danh sách phiếu dịch vụ thành công.",
      ...tickets,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy danh sách phiếu dịch vụ: ${error.message}`)
    );
  }
};

exports.getServiceTicketByCustomer = async (req, res, next) => {
  try {
    const user = req.user;
    const tickets = await ServiceTicketService.getTicketByCustomerId(user.user_id);
    res.status(200).json({
      message: "Lấy danh sách phiếu dịch vụ của khách hàng thành công.",
      data: tickets,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy danh sách phiếu dịch vụ của khách hàng: ${error.message}`)
    );
  }
};

exports.getScheduleSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    const slots = await ServiceTicketService.getScheduleSlots(date);
    res.status(200).json({
      message: "Lấy các khung giờ lịch bảo trì thành công.",
      data: slots,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy khung giờ lịch bảo trì: ${error.message}`)
    );
  }
};

exports.createServiceTicket = async (req, res, next) => {
  try {
    const ticketData = req.body;
    const newTicket = await ServiceTicketService.createTicket(ticketData,req.user);
    res.status(201).json({
      message: "Tạo phiếu dịch vụ thành công.",
      data: newTicket,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi tạo phiếu dịch vụ: ${error.message}`)
    );
  }
};

exports.updateServiceTicket = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const updateData = req.body;
    const updatedTicket = await ServiceTicketService.updateTicket(
      ticketId,
      updateData
    );
    res.status(200).json({
      message: "Cập nhật phiếu dịch vụ thành công.",
      data: updatedTicket,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật phiếu dịch vụ: ${error.message}`)
    );
  }
};