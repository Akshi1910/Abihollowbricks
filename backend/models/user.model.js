const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["admin", "user"], // Allowed roles
            default: "user", // Default role is employee
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
