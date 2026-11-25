const mongoose = require('mongoose');
const ScanRecord = require('../models/ScanRecord');
const Customer = require('../models/Customer');
const CustomerPrediction = require('../models/CustomerPrediction');

const getDashboardSummary = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.userId;

    let customerFilter = {};
    let scanFilter = {};
    if (!isAdmin && userId) {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      customerFilter = { user: userObjectId };
      scanFilter = { uploadedBy: userObjectId };
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
      riskData
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
      ])
    ]);

    const totals = customerTotals[0] || { totalRevenue: 0, activeCustomers: 0, returningCustomers: 0 };
    const highValueCustomers = predictions.filter(p => ['VIP', 'Loyal'].includes(p.segment)).length;
    const segmentDistribution = predictions.reduce((acc, prediction) => {
      const key = prediction.segment || 'Unclassified';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalCustomers,
      activeCustomers: totals.activeCustomers,
      highValueCustomers,
      returningCustomers: totals.returningCustomers,
      totalRevenue: Number(totals.totalRevenue || 0),
      averageCustomerValue: totalCustomers ? Number((totals.totalRevenue / totalCustomers).toFixed(2)) : 0,
      segmentDistribution,
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
