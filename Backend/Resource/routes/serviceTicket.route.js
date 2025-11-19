const express = require("express");
const ServiceTicketController = require("../controllers/serviceTicket.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "mechanic"),
  ServiceTicketController.getServiceTickets
);

router.get("/schedule", ServiceTicketController.getScheduleSlots);

router.get(
  "/customer",
  authMiddleware,
  authorizeRoles("user"),
  ServiceTicketController.getServiceTicketByCustomer
);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("user", "admin", "mechanic"),
  ServiceTicketController.createServiceTicket
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "mechanic"),
  ServiceTicketController.updateServiceTicket
);

module.exports = router;
