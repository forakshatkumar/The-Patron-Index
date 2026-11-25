const Transaction = require('../models/Transaction');

const getTransactions = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const filter = (!isAdmin && req.user?.userId) ? { user: req.user.userId } : {};
    const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).limit(1000);
    res.json({ count: transactions.length, transactions });
  } catch (error) {
    next(error);
  }
};

const getCustomerTransactions = async (req, res, next) => {
  try {
    const customerId = String(req.params.id || '').trim();
    const isAdmin = req.user?.role === 'admin';
    const filter = { customerId };
    if (!isAdmin && req.user?.userId) {
      filter.user = req.user.userId;
    }
    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ count: transactions.length, transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getCustomerTransactions
};

