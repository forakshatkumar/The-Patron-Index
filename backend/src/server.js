const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');
const customerRoutes = require('./routes/customers');
const dashboardRoutes = require('./routes/dashboard');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true,
  credentials: false
}));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorMiddleware);

const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function ensureDefaultAccounts () {
  try {
    const demoEmail = 'demo@patronindex.com';
    const existing = await User.findOne({ email: demoEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Demo Business',
        email: demoEmail,
        password: hashedPassword,
        role: 'analyst'
      });
      console.log('Seeded demo account: demo@patronindex.com / password123');
    }
  } catch (err) {
    console.error('Failed to ensure default account:', err.message);
  }
}

async function startServer () {
  await connectDB();
  await ensureDefaultAccounts();
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer();
