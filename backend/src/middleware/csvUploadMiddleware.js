const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const name = String(file.originalname || '').toLowerCase();
    const mime = String(file.mimetype || '').toLowerCase();
    const valid = name.endsWith('.csv') || mime.includes('csv') || mime === 'text/plain';

    if (!valid) return cb(new Error('Only CSV files can be imported as customer data'));
    cb(null, true);
  }
});

module.exports = upload;
