const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getTransactions, getCustomerTransactions } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', authMiddleware, getTransactions);
router.get('/customer/:id', authMiddleware, getCustomerTransactions);

module.exports = router;

