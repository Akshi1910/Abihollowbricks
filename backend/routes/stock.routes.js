const express = require("express");
const router = express.Router();
const Stock = require("../models/stock.model");

// Get all stock info
router.get("/", async (req, res) => {
    try {
        const stock = await Stock.findOne({});
        res.json(stock);
    } catch (err) {
        console.error("Error fetching stock:", err.message);
        res.status(500).json({ message: "Error fetching stock" });
    }
});

// Update hollow brick rate (4inch or 6inch)
router.put("/update-brick-rate", async (req, res) => {
    const { type, rate } = req.body;

    if (!type || rate === undefined) {
        return res.status(400).json({ message: "Type and rate are required" });
    }

    try {
        const stock = await Stock.findOneAndUpdate(
            {},
            { $set: { [`brickRates.${type}`]: rate } },
            { new: true, upsert: true }
        );
        res.json(stock);
    } catch (err) {
        console.error("Error updating brick rate:", err.message);
        res.status(500).json({ message: "Error updating brick rate" });
    }
});

// Update delivery rate
router.put("/update-delivery-rate", async (req, res) => {
    const { deliveryRate } = req.body;

    if (deliveryRate === undefined) {
        return res.status(400).json({ message: "Delivery rate is required" });
    }

    try {
        const stock = await Stock.findOneAndUpdate(
            {},
            { $set: { deliveryRate } },
            { new: true, upsert: true }
        );
        res.json(stock);
    } catch (err) {
        console.error("Error updating delivery rate:", err.message);
        res.status(500).json({ message: "Error updating delivery rate" });
    }
});

// Update stock quantity (4inch or 6inch)
router.put("/update-stock-qty", async (req, res) => {
    const { type, quantity } = req.body;

    if (!type || quantity === undefined) {
        return res.status(400).json({ message: "Type and quantity are required" });
    }

    try {
        const stock = await Stock.findOneAndUpdate(
            {},
            { $set: { [`stockQty.${type}`]: quantity } },
            { new: true, upsert: true }
        );
        res.json(stock);
    } catch (err) {
        console.error("Error updating stock quantity:", err.message);
        res.status(500).json({ message: "Error updating stock quantity" });
    }
});
// Reduce stock quantity after order acceptance
// Alias mapping for type normalization, same as in the frontend

// stockRoutes.js (adjusted to handle different type variations)
router.put("/reduce-stock", async (req, res) => {
    try {
      const { type, quantity } = req.body;
  
      const typeAlias = {
        "4 inches": "4inch",
        "4 inched": "4inch",
        "6 inches": "6inch",
        "6 inched": "6inch",
      };
  
      const normalizedType = typeAlias[type] || type;
  
      if (!normalizedType || !quantity) {
        return res.status(400).json({ message: "Type and quantity are required" });
      }
  
      if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
      }
  
      // Get the only stock document (assuming there's only one)
      const stock = await Stock.findOne();
  
      if (!stock || !stock.stockQty.has(normalizedType)) {
        return res.status(404).json({ message: "Stock not found for type: " + normalizedType });
      }
  
      const currentQty = stock.stockQty.get(normalizedType);
  
      if (currentQty < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
  
      // Reduce quantity
      stock.stockQty.set(normalizedType, currentQty - quantity);
  
      await stock.save();
  
      return res.status(200).json({
        message: `${quantity} ${normalizedType} bricks reduced successfully`,
        updatedQty: stock.stockQty.get(normalizedType)
      });
  
    } catch (error) {
      console.error("Error reducing stock:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

module.exports = router;
