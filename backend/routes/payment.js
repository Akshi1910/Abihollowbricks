// routes/payment.js
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
require("dotenv").config(); // usually at the top of server.js

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: req.body.receipt,
      notes: req.body.notes
    };
console.log(process.env.RAZORPAY_KEY_ID);
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Confirm order
router.post('/confirm-order', async (req, res) => {
  try {
    // Save order to database
    // Send confirmation email
    // Any other post-payment logic
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error confirming order' });
  }
});

module.exports = router;