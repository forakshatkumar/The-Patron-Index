const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.status === 403) return res.status(403).json({ message: 'Origin not allowed' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON request' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request is too large' });
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.status === 400) return res.status(400).json({ message: 'Invalid input', ...(err.status === 400 ? { message: err.message } : {}) });
  console.error('Error:', process.env.NODE_ENV === 'production' ? err.name : err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File size cannot exceed 4 MB' });
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
