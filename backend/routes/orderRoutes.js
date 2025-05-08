const express = require("express");
const { createOrder, getOrders, updateOrder } = require("../controllers/orderController");
const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders); // Fetch all orders (admin view)
router.put("/:id", updateOrder); // Admin updates order

module.exports = router;
