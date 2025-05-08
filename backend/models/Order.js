const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  brickType: String,
  brickQuantity: Number,
  deliveryDate: String,
  deliveryStatus: { type: String, default: "Pending" },
  selectedStones: [
    {
      id: Number,
      name: String,
      image: String,
      quantity: Number,
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now, // Automatically set to current date/time
  },
});

module.exports = mongoose.model("Order", orderSchema);
