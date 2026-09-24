const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const csvUpload = require('../middleware/csvUploadMiddleware');
const {
  createCustomer,
  getCustomers,
  getCustomer,
  importCustomers
} = require('../controllers/customerController');

const router = express.Router();

router.post('/', authMiddleware, createCustomer);
router.post('/import', authMiddleware, csvUpload.single('file'), importCustomers);
router.get('/', authMiddleware, getCustomers);
router.get('/:id', authMiddleware, getCustomer);

module.exports = router;
