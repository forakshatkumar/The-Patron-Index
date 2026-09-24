const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size cannot exceed 10 MB' });
  }
  if (err.message === 'This file type is not allowed' || err.message?.includes('CSV files')) {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with this identifier already exists' });
  }

  return res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
};

module.exports = errorMiddleware;
