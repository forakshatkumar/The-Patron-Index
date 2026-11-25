const mongoose = require('mongoose');

let pending;
let listenersInstalled = false;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (pending) return pending;
  const uri = process.env.MONGO_URI ||
    (process.env.NODE_ENV !== 'production' && !process.env.VERCEL ? 'mongodb://127.0.0.1:27017/patron-index' : '');
  if (!uri) throw new Error('MONGO_URI is not configured');

  if (!listenersInstalled) {
    mongoose.connection.on('error', () => console.error('MongoDB runtime error'));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
    listenersInstalled = true;
  }

  // Share a connection attempt across concurrent requests in a warm Function.
  pending = mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000
  }).then(() => mongoose.connection);
  try {
    return await pending;
  } finally {
    pending = undefined;
  }
}
module.exports = connectDB;
