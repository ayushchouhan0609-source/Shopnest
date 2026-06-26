const Order = require('../models/Order');
const User = require('../models/userModel');
const Product = require('../models/Product');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find({});
    const totalRevenueData = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenueData,
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }

    };
module.exports = {
  getAdminStats,
};