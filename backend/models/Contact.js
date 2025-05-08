const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  message: String,
}, { timestamps: true });

// Fix: Prevent overwriting the model
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

module.exports = Contact;
