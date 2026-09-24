const ScanRecord = require('../models/ScanRecord');
const Customer = require('../models/Customer');
const CustomerPrediction = require('../models/CustomerPrediction');

const getDashboardSummary = async (req, res, next) => {
  try {
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
      ScanRecord.countDocuments(),
      ScanRecord.countDocuments({ status: 'completed' }),
      ScanRecord.countDocuments({ status: 'pending' }),
      ScanRecord.countDocuments({ status: 'failed' }),
      Customer.countDocuments(),
      Customer.aggregate([
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
      CustomerPrediction.find({}, 'segment patronIndex').lean(),
      ScanRecord.aggregate([
        { $match: { riskScore: { $ne: null } } },
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
