const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Upload limit reached. Please wait before uploading more files.'
  }
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this client. Please slow down.'
  }
});

module.exports = { authLimiter, uploadLimiter, apiLimiter };

