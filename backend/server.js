const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes=require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const stockRoutes = require("./routes/stock.routes");
const inventoryRoutes = require("./routes/inventory.route");
const Order=require("./models/Order");
const Stock=require("./models/stock.model")
const payment=require("./routes/payment");
dotenv.config();
connectDB();

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/orders", orderRoutes);
app.use("/contact", contactRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/payment",payment);
// DELETE a user order
app.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Order.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
  
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
  
      try {
        // Fetch user from DB
        const user = await User.findOne({ email: decoded.email }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
  
        req.user = user;
        next();
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
    });
  };
  
  // Fetch user details (Protected Route)
  app.get("/api/user", authenticateToken, (req, res) => {
    res.json({
      fullName: req.user.fullName,
      email: req.user.email,
      profilePic: req.user.profilePic,
      role: req.user.role,
    });
  });
  app.get("/rates", async (req, res) => {
    const stock = await Stock.findOne();
    if (!stock) return res.status(404).json({ message: "No stock found" });
  
    const rates = Object.fromEntries(stock.brickRates);
    res.json({
      brickRates: {
        "4 inches": rates["4inch"],
        "6 inches": rates["6inch"],
      },
      deliveryRate: stock.deliveryRate
    });
  });
  
// In your Express backend (Node.js)
app.put("/orders/:id/deliver", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: "Delivered" },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error marking as delivered", error);
    res.status(500).send("Internal Server Error");
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
