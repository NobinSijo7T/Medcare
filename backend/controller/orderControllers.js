const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: "No order items" });
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      if (req.body.status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set reminder for order
// @route   PUT /api/orders/:id/reminder
// @access  Private
const setOrderReminder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Check if the order belongs to the user
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to set reminder for this order" });
      }

      order.reminder = {
        isSet: true,
        reminderDate: req.body.reminderDate,
        reminderTime: req.body.reminderTime || "09:00",
        reminderMessage: req.body.reminderMessage || "Time to reorder your medication",
        notificationShown: false,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active reminders for user
// @route   GET /api/orders/reminders/active
// @access  Private
const getActiveReminders = async (req, res) => {
  try {
    const now = new Date();

    // Get reminders that are set and not yet shown for this user
    const orders = await Order.find({
      user: req.user._id,
      "reminder.isSet": true,
      "reminder.notificationShown": false,
    }).sort({ "reminder.reminderDate": 1 });

    // Filter to show reminders whose scheduled date+time is due
    const activeOrders = orders.filter(order => {
      if (!order.reminder || !order.reminder.reminderDate) return false;

      const time = order.reminder.reminderTime || "09:00";
      const [hours, minutes] = time.split(":").map((value) => Number(value));

      if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

      const reminderDateTime = new Date(order.reminder.reminderDate);
      reminderDateTime.setHours(hours, minutes, 0, 0);

      return now >= reminderDateTime;
    });

    res.json(activeOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark reminder as shown
// @route   PUT /api/orders/:id/reminder/shown
// @access  Private
const markReminderShown = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Check if the order belongs to the user
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (order.reminder && order.reminder.isSet) {
        order.reminder.notificationShown = true;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(400).json({ message: "No reminder set for this order" });
      }
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
  setOrderReminder,
  getActiveReminders,
  markReminderShown,
};
