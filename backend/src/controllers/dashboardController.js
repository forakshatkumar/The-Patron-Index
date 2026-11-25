const mongoose = require('mongoose');
const ScanRecord = require('../models/ScanRecord');
const Customer = require('../models/Customer');
const CustomerPrediction = require('../models/CustomerPrediction');
const Transaction = require('../models/Transaction');

const getDashboardSummary = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.userId;

    let customerFilter = {};
    let scanFilter = {};
    let txnFilter = {};
    if (!isAdmin && userId) {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      customerFilter = { user: userObjectId };
      scanFilter = { uploadedBy: userObjectId };
      txnFilter = { user: userObjectId };
    }

    const userCustomers = await Customer.find(customerFilter, '_id').lean();
    const customerIds = userCustomers.map(c => c._id);

    const [
      totalScans,
      completedScans,
      pendingScans,
      failedScans,
      totalCustomers,
      customerTotals,
      predictions,
      riskData,
      transactions
    ] = await Promise.all([
      ScanRecord.countDocuments(scanFilter),
      ScanRecord.countDocuments({ ...scanFilter, status: 'completed' }),
      ScanRecord.countDocuments({ ...scanFilter, status: 'pending' }),
      ScanRecord.countDocuments({ ...scanFilter, status: 'failed' }),
      Customer.countDocuments(customerFilter),
      Customer.aggregate([
        { $match: customerFilter },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalSpent' },
            activeCustomers: {
              $sum: { $cond: [{ $gt: ['$totalOrders', 0] }, 1, 0] }
            },
            returningCustomers: {
              $sum: { $cond: [{ $gt: ['$totalOrders', 1] }, 1, 0] }
            }
          }
        }
      ]),
      CustomerPrediction.find({ customer: { $in: customerIds } }, 'segment patronIndex').lean(),
      ScanRecord.aggregate([
        { $match: { ...scanFilter, riskScore: { $ne: null } } },
        { $group: { _id: null, averageRiskScore: { $avg: '$riskScore' } } }
      ]),
      Transaction.find({ ...txnFilter, source: { $ne: 'summary' }, product: { $ne: 'Direct Order' } }).select('date customerId amount transactionId customerName category paymentMethod status').sort({ date: 1, createdAt: 1 }).lean()
    ]);

    const totals = customerTotals[0] || { totalRevenue: 0, activeCustomers: 0, returningCustomers: 0 };
    const highValueCustomers = predictions.filter(p => ['VIP', 'Loyal'].includes(p.segment)).length;
    const segmentDistribution = predictions.reduce((acc, prediction) => {
      const key = prediction.segment || 'Unclassified';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Compute genuine monthly revenue trajectory and monthly activity
    const monthlyMap = new Map();
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (const t of transactions) {
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) continue;
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
      const entry = monthlyMap.get(monthKey) || {
        month: monthLabel,
        key: monthKey,
        value: 0,
        customers: new Set()
      };
      entry.value += Number(t.amount || 0);
      if (t.customerId) entry.customers.add(t.customerId);
      monthlyMap.set(monthKey, entry);
    }

    const sortedMonthKeys = Array.from(monthlyMap.keys()).sort();
    const monthlyRevenue = sortedMonthKeys.map(k => ({ label: monthlyMap.get(k).month, value: Number(monthlyMap.get(k).value.toFixed(2)) }));
    // Count first recorded purchase month, rather than estimating with fixed ratios.
    const seen = new Set();
    const monthlyGrowth = [];
    const monthlyActivity = sortedMonthKeys.map(k => {
      const item = monthlyMap.get(k);
      let newCustomers = 0, repeatCustomers = 0;
      for (const id of item.customers) {
        if (seen.has(id)) repeatCustomers++;
        else { newCustomers++; seen.add(id); }
      }
      monthlyGrowth.push({ label: item.month, customers: seen.size });
      return { month: item.month, newCustomers, repeatCustomers };
    });

    res.json({
      totalCustomers,
      activeCustomers: predictions.filter(p => p.segment && p.segment !== 'Inactive' && p.segment !== 'At-Risk').length,
      highValueCustomers,
      returningCustomers: totals.returningCustomers,
      totalRevenue: Number(totals.totalRevenue || 0),
      averageCustomerValue: totalCustomers ? Number((totals.totalRevenue / totalCustomers).toFixed(2)) : 0,
      segmentDistribution,
      monthlyRevenue,
      monthlyActivity,
      monthlyGrowth,
      recentTransactions: transactions.slice(-5).reverse(),
      security: {
        totalScans,
        completedScans,
        pendingScans,
        failedScans,
        averageRiskScore: riskData.length ? Number(riskData[0].averageRiskScore.toFixed(2)) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardSummary };
