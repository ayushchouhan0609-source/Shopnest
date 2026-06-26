const Order = require('../models/Order');
const {sendEmail} = require('../utils/sendEmail');

// Create Order
const createOrder = async (req, res) => {
  try {
    console.log('===== createOrder called =====');
    const { items, totalPrice, shippingAddress, paymentId } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: 'No order items provided',
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: 'Shipping address is required',
      });
    }

    const order = new Order({
      user: req.user._id,

      // Schema me products hai
      products: items,

      totalAmount: totalPrice,

      // Schema me address hai
      address: {
        fullName: shippingAddress.fullName,
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },

      paymentId: paymentId || 'N/A',
    });

    await order.save();
    console.log('Order Saved:', order._id);

    const itemRows = order.products.map((item, index) => {
      const amount = (item.price || 0) * (item.quantity || 1);
      return `${index + 1}. Product ID: ${item.product} \n   Quantity: ${item.quantity} \n   Price: ₹${item.price.toFixed(2)}\n   Amount: ₹${amount.toFixed(2)}`;
    }).join('\n\n');

    const shipping = order.address;
    const userName = req.user.name || 'Valued Customer';
    const orderUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success`;

    const textBody = `Dear ${userName},\n\n` +
      `Thank you for placing your order with ShopNest!\n\n` +
      `Order ID: ${order._id}\n` +
      `Total Amount: ₹${order.totalAmount.toFixed(2)}\n` +
      `Payment ID: ${order.paymentId || 'N/A'}\n\n` +
      `Order details:\n${itemRows}\n\n` +
      `Shipping Address:\n` +
      `${shipping.fullName}\n` +
      `${shipping.street}\n` +
      `${shipping.city}, ${shipping.postalCode}\n` +
      `${shipping.country}\n\n` +
      `We will notify you once your order is shipped.\n\n` +
      `Best regards,\n` +
      `The ShopNest Team\n` +
      `${orderUrl}`;

    const htmlBody = `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <div style="max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff;">
        <h2 style="color:#1f2937;">Dear ${userName},</h2>
        <p style="font-size: 16px; color: #374151;">Thank you for placing your order with <strong>ShopNest</strong>!</p>
        <p style="font-size: 16px; color: #374151;">Your order has been received and we are processing it now.</p>
        <h3 style="color: #111827;">Order Summary</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 18px;">
          <tr>
            <td style="padding: 8px 0;">Order ID:</td>
            <td style="padding: 8px 0; font-weight: 700;">${order._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Total Amount:</td>
            <td style="padding: 8px 0; font-weight: 700;">₹${order.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Payment ID:</td>
            <td style="padding: 8px 0; font-weight: 700;">${order.paymentId || 'N/A'}</td>
          </tr>
        </table>
        <h3 style="color: #111827;">Items Ordered</h3>
        <ul style="padding-left: 20px; color: #374151;">
          ${order.products.map((item) => {
            const amount = (item.price || 0) * (item.quantity || 1);
            return `<li style="margin-bottom: 12px;"><strong>Product ID:</strong> ${item.product}<br><strong>Quantity:</strong> ${item.quantity}<br><strong>Price:</strong> ₹${item.price.toFixed(2)}<br><strong>Amount:</strong> ₹${amount.toFixed(2)}</li>`;
          }).join('')}
        </ul>
        <h3 style="color: #111827;">Shipping Address</h3>
        <p style="color: #374151; margin-bottom: 18px;">${shipping.fullName}<br>${shipping.street}<br>${shipping.city}, ${shipping.postalCode}<br>${shipping.country}</p>
        <p style="color: #374151;">We will send you another update once your order is shipped.</p>
        <p style="color: #374151;">Best regards,<br><strong>The ShopNest Team</strong></p>
        <p style="font-size: 12px; color: #6b7280;">If you have any questions, reply to this email or visit our website.</p>
      </div>
    </body></html>`;

    console.log('Sending email to:', req.user.email);
    await sendEmail({
      to: req.user.email,
      subject: 'Your ShopNest Order Confirmation',
      text: textBody,
      html: htmlBody,
    });
    console.log('Email Sent Successfully');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User Orders
const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate('user', 'name email');

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Orders (Admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      'user',
      'name email'
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
};