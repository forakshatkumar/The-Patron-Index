const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) throw new Error('MONGO_URI must be configured in production');
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patron-index';

  try {
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 15,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000
    });

    console.log(`MongoDB connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('error', err => {
    console.error('MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully.');
  });
};

module.exports = connectDB;
