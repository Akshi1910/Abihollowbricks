const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  brickRates: {
    type: Map,
    of: Number,
    default: {}, // e.g., { "4inch": 30, "6inch": 35 }
  },
  stockQty: {
    type: Map,
    of: Number,
    default: {}, // e.g., { "4inch": 1000, "6inch": 700 }
  },
  deliveryRate: { type: Number, default: 0 }
});

module.exports = mongoose.model("Stock", stockSchema);
