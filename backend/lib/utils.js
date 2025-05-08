const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },  // Include role in token
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Token set in cookie:", token);
    return token;
};

module.exports = { generateToken };
