const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ quiet: true });

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');
const customerRoutes = require('./routes/customers');
const dashboardRoutes = require('./routes/dashboard');
const transactionRoutes = require('./routes/transactions');
const errorMiddleware = require('./middleware/errorMiddleware');
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middleware/rateLimitMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

// Trust the deployment reverse proxy for client IP resolution
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// Security: Helmet header hardening
app.use(helmet({
  contentSecurityPolicy: false, // Let frontend handle its own CSP or allow cross-origin API calls
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(u => u.trim().replace(/\/$/, '')).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://localhost:3000'];

// Same-origin requests need no CORS, but browsers send Origin on writes.
const knownVercelOrigins = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
  .filter(Boolean).map(host => `https://${host}`);
app.use(cors((req, callback) => {
  const origin = req.get('origin');
  const host = req.get('host');
  const sameOrigin = Boolean(process.env.VERCEL && host && origin === `https://${host}`);
  if (origin && !sameOrigin && !allowedOrigins.includes(origin) && !knownVercelOrigins.includes(origin)) {
    return callback(Object.assign(new Error('Origin not allowed'), { status: 403 }));
  }
  callback(null, {
    origin: origin || false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Patron-Request']
  });
}));

// Require a non-simple header on cookie-capable writes to prevent cross-site form requests.
app.use('/api', (req, res, next) => {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers['x-patron-request'] !== '1' && !req.headers.authorization?.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Request verification failed' });
  }
  next();
});
app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
// Request body size limits and input sanitization
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(sanitizeMiddleware);

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/google', authLimiter);
app.use('/api/scan/upload', uploadLimiter);
app.use('/api/customers/import', uploadLimiter);

// Root API status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'The Patron Index API',
    version: '1.0.0',
    documentation: 'https://the-patron-index.vercel.app',
    health: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try { await connectDB(); } catch { /* Report unavailable without exposing credentials. */ }
  }
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'unavailable',
    service: 'backend',
    timestamp: new Date().toISOString()
  });
});

// Cold starts do not run startServer(). Establish the database before business routes.
app.use('/api', async (req, res, next) => {
  if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') return next();
  try { await connectDB(); next(); }
  catch {
    console.error('Database unavailable; check MONGO_URI and Atlas network access.');
    res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
  }
});

// Primary route mounting
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);

app.use('/api', (_req, res) => res.status(404).json({ message: 'API route not found' }));

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
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL && !process.env.FRONTEND_URL) throw new Error('FRONTEND_URL must be configured in production');
  await connectDB();
  if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEMO_ACCOUNT === 'true') await ensureDefaultAccounts();
  server = app.listen(PORT, '0.0.0.0', () => {
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

if (require.main === module) {
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  startServer().catch(error => { console.error('Backend startup failed:', error.message); process.exit(1); });
}
module.exports = { app, startServer };
