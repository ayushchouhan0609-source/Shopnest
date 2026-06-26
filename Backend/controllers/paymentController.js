const Razorpay = require('razorpay');
const crypto = require('crypto');
const { create } = require('../models/userModel');
require('dotenv').config();

const createdOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: req.body.amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };
    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const generated_signature = crypto

    crypto.createhmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature === razorpay_signature) {
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

module.exports = {
  createOrder: createdOrder,
  verifyPayment,
};  
