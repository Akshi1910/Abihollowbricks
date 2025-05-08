const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/auth.middleware");

router.get("/me", protectRoute, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
