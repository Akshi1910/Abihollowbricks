const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const protectRoute = async (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.jwt) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};

const employeeOnly = (req, res, next) => {
    if (req.user.role !== "employee") {
        return res.status(403).json({ message: "Access denied: Employees only" });
    }
    next();
};

const managerOnly = (req, res, next) => {
    if (req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied: Managers only" });
    }
    next();
};

// Middleware to allow Admin, Employee, and Manager
const adminEmployeeManager = (req, res, next) => {
    const allowedRoles = ["admin", "employee", "manager"];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: Admins, Employees, and Managers only" });
    }
    next();
};

module.exports = { protectRoute ,adminOnly, employeeOnly, managerOnly, adminEmployeeManager };
