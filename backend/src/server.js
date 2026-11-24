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
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middleware/rateLimitMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Helmet header hardening
app.use(helmet({
  contentSecurityPolicy: false, // Let frontend handle its own CSP or allow cross-origin API calls
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(u => u.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Cross-Origin Request Blocked by Security Policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body size limits and input sanitization
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(sanitizeMiddleware);

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/scan/upload', uploadLimiter);
app.use('/api/customers/import', uploadLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString()
  });
});

// Primary route mounting
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Central error handling
app.use(errorMiddleware);

const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function ensureDefaultAccounts () {
  try {
    const demoEmail = 'demo@patronindex.com';
    const existing = await User.findOne({ email: demoEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('password123', 12);
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

let server;

async function startServer () {
  await connectDB();
  await ensureDefaultAccounts();
  server = app.listen(PORT, () => {
    console.log(`Backend server running securely on port ${PORT}`);
  });
}

// Graceful process termination
const shutdown = () => {
  console.log('Received termination signal. Closing HTTP server gracefully...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
