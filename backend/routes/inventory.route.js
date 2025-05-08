// routes/inventory.route.js
const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory.model");

// Get inventory
router.get("/", async (req, res) => {
  try {
    let inventory = await Inventory.findOne();
    if (!inventory) {
      // Create a default inventory if none exists
      inventory = new Inventory();
      await inventory.save();
    }
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update material
router.put("/update", async (req, res) => {
  const { type, quantity } = req.body;

  try {
    let inventory = await Inventory.findOne();
    if (!inventory) {
      inventory = new Inventory();
    }

    if (["cement", "sand", "aggregates", "water"].includes(type)) {
      inventory[type] = quantity;
      await inventory.save();
      return res.status(200).json({ message: "Inventory updated", inventory });
    } else {
      return res.status(400).json({ error: "Invalid material type" });
    }
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
