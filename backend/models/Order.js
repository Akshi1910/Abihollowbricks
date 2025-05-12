const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  brickType: String,
  brickQuantity: Number,
  paymentMethod: String,  // New field
  amount: Number,         // New field
  deliveryDate: String,
  deliveryStatus: { type: String, default: "Pending" },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
