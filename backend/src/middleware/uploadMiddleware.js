const multer = require('multer');
const path = require('path');
const fs = require('fs');

const quarantineDir = path.join(process.cwd(), 'uploads', 'quarantine');
fs.mkdirSync(quarantineDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, quarantineDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
  }
});

const allowedExtensions = [
  '.csv', '.xlsx', '.xls', '.txt', '.pdf', '.doc', '.docx', '.zip', '.exe', '.dll'
];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(extension)) return cb(new Error('This file type is not allowed'));
  cb(null, true);
};

module.exports = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});
