const multer = require('multer');
const path = require('path');
// Files are held in memory for the duration of the request, never on a deployment filesystem.
const storage = multer.memoryStorage();

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
  limits: { files: 1, fileSize: 4 * 1024 * 1024 },
  fileFilter
});
