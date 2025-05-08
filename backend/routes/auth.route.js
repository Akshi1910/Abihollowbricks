const express=require("express");
const router=express.Router();
const {signup,login,logout,updateProfile,checkAuth} =require("../controllers/auth.controller")
const {protectRoute}=require("../middleware/auth.middleware")
const { adminOnly, employeeOnly, managerOnly, adminEmployeeManager } = require("../middleware/auth.middleware");

// Admin dashboard route (Admins only)
router.get("/admin-dashboard", protectRoute, adminOnly, (req, res) => {
    res.status(200).json({ message: "Welcome to Admin Dashboard" });
});

// Employee dashboard route (Employees only)
router.get("/employee-dashboard", protectRoute, employeeOnly, (req, res) => {
    res.status(200).json({ message: "Welcome to Employee Dashboard" });
});

// Manager dashboard route (Managers only)
router.get("/manager-dashboard", protectRoute, managerOnly, (req, res) => {
    res.status(200).json({ message: "Welcome to Manager Dashboard" });
});

// Route accessible to Admin, Employee, and Manager
router.get("/common-dashboard", protectRoute, adminEmployeeManager, (req, res) => {
    res.status(200).json({ message: "Welcome to Common Dashboard for Admins, Employees, and Managers" });
});


router.post("/signup",signup)
router.post("/login",login);
router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);

module.exports=router;