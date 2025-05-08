const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error placing order" });
  }
};


// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// Update order (Admin sets delivery date and status)
exports.updateOrder = async (req, res) => {
  try {
    const { deliveryDate, deliveryStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryDate, deliveryStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ error: "Error updating order" });
  }
};
