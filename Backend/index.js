const dotenv = require('dotenv');
// Load .env as early as possible so other modules can use process.env during their initialization
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/authRoutes');

connectDB();

const app = express();

app.use(cors(
    {origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
       credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Shopnest Backend is working properly!');
});

// Dev-only: test email endpoint — POST { to, subject, text }
if (process.env.NODE_ENV !== 'production') {
    const { sendEmail } = require('./utils/sendEmail');
    app.post('/dev/test-email', async (req, res) => {
        const { to, subject, text } = req.body || {};
        const dest = to || process.env.EMAIL_USER;
        if (!dest) return res.status(400).json({ success: false, message: 'No recipient specified and EMAIL_USER not set' });
        try {
            const info = await sendEmail({ to: dest, subject: subject || 'Shopnest Test', text: text || 'Test email from Shopnest' });
            return res.json({ success: true, info });
        } catch (err) {
            console.error('Dev test-email error:', err);
            return res.status(500).json({ success: false, message: err.message || 'send failed', stack: err.stack });
        }
    });
}

app.use('/api/auth', userRoutes);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});