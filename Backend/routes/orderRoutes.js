const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

// Create Order & Get All Orders (Admin)
router
  .route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

// Logged-in User Orders
router.route('/myorders').get(protect, myOrders);

// Update Order Status (Admin)
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;