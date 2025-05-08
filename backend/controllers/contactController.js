const Contact = require("../models/Contact");

const sendMessage = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, message } = req.body;
    const newContact = new Contact({ firstName, lastName, phone, email, message });
    await newContact.save();
    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message!" });
  }
};

module.exports = { sendMessage }; // Ensure it is correctly exported
