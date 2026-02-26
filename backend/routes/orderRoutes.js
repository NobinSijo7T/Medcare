const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
  setOrderReminder,
  getActiveReminders,
  markReminderShown,
} = require("../controller/orderControllers");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/reminders/active").get(protect, getActiveReminders);
router.route("/admin/all").get(protect, admin, getAllOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/status").put(protect, admin, updateOrderStatus);
router.route("/:id/reminder").put(protect, setOrderReminder);
router.route("/:id/reminder/shown").put(protect, markReminderShown);

module.exports = router;
