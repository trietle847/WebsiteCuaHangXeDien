const express = require("express");
const ServiceTicketController = require("../controllers/serviceTicket.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
<<<<<<< HEAD
  "/",
  authMiddleware,
  authorizeRoles("admin", "mechanic"),
  ServiceTicketController.getServiceTickets
);

router.get("/schedule", ServiceTicketController.getScheduleSlots);

=======
  "/schedule",
  ServiceTicketController.getScheduleSlots
);

>>>>>>> 71ee04052ad983ffe5ad37ddf72ce22a09120f26
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
