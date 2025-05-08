// models/inventory.model.js
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  cement: { type: Number, default: 0 },
  sand: { type: Number, default: 0 },
  aggregates: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
});

module.exports = mongoose.model("Inventory", inventorySchema);
