const Customer = require('../models/Customer');
const CustomerFeature = require('../models/CustomerFeature');
const CustomerPrediction = require('../models/CustomerPrediction');
const Transaction = require('../models/Transaction');
const createAuditLog = require('../utils/auditLogger');
const {
  calculatePatronIndex,
  classifyCustomer,
  recommendationFor,
  customerStatus
} = require('../utils/customerScoring');

const { runImport } = require('../utils/smartImport');
const crypto = require('crypto');

async function enrichCustomer(customer, loaded) {
  const [features, prediction] = loaded || await Promise.all([
    CustomerFeature.findOne({ customer: customer._id }).lean(),
    CustomerPrediction.findOne({ customer: customer._id }).lean()
  ]);

  const fallbackFeatures = {
    recency: 0,
    frequency: customer.totalOrders || 0,
    monetary: customer.totalSpent || 0,
    averageOrderValue: customer.totalOrders
      ? Number((customer.totalSpent / customer.totalOrders).toFixed(2))
      : 0
  };
  const f = features || fallbackFeatures;
  const patronIndex = prediction?.patronIndex ?? calculatePatronIndex(f);
  const segment = prediction?.segment || classifyCustomer({ ...f, patronIndex });

  return {
    customerId: customer.customerId,
    name: customer.name,
    email: customer.email,
    totalSpent: customer.totalSpent,
    totalOrders: customer.totalOrders,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    features: f,
    prediction: {
      segment,
      patronIndex,
      atRiskProbability: prediction?.atRiskProbability ?? null,
      recommendation: prediction?.recommendation || recommendationFor(segment),
      modelVersion: prediction?.modelVersion || 'rfm-v1'
    },
    status: customerStatus(segment)
  };
}

const createCustomer = async (req, res, next) => {
  try {
    const { customerId, name, email, totalSpent = 0, totalOrders = 0 } = req.body;
    if (![customerId, name, email].every(v => typeof v === 'string' && v.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !Number.isFinite(Number(totalSpent)) || Number(totalSpent) < 0 || !Number.isInteger(Number(totalOrders)) || Number(totalOrders) < 0) {
      return res.status(400).json({ message: 'customerId, name and email are required' });
    }

    const cleanCustomerId = String(customerId).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();

    const existingCustomer = await Customer.findOne({ customerId: cleanCustomerId, user: req.user?.userId });
    if (existingCustomer) return res.status(409).json({ message: 'Customer already exists in your registry' });

    const customer = await Customer.create({
      customerId: cleanCustomerId,
      name: cleanName,
      email: cleanEmail,
      totalSpent: Math.max(0, Number(totalSpent) || 0),
      totalOrders: Math.max(0, Number(totalOrders) || 0),
      user: req.user?.userId
    });

    if (customer.totalSpent > 0 && req.user?.userId) {
      await Transaction.create({
        transactionId: `TXN-${crypto.randomUUID()}`,
        customerId: customer.customerId,
        customerName: customer.name,
        amount: customer.totalSpent,
        date: new Date().toISOString().split('T')[0],
        source: 'summary',
        product: 'Direct Order',
        category: 'Sales',
        paymentMethod: 'Not specified',
        status: 'Completed',
        user: req.user.userId
      }).catch(err => console.error('Failed to create initial transaction:', err.message));
    }

    const features = {
      recency: 0,
      frequency: Number(customer.totalOrders || 0),
      monetary: Number(customer.totalSpent || 0),
      averageOrderValue: customer.totalOrders ? Number((customer.totalSpent / customer.totalOrders).toFixed(2)) : 0
    };
    const patronIndex = calculatePatronIndex(features);
    const segment = classifyCustomer({ ...features, patronIndex });

    await Promise.all([
      CustomerFeature.create({ customer: customer._id, ...features }),
      CustomerPrediction.create({
        customer: customer._id,
        segment,
        patronIndex,
        recommendation: recommendationFor(segment),
        modelVersion: 'rfm-v1'
      })
    ]);

    await createAuditLog({
      userId: req.user.userId,
      action: 'CUSTOMER_CREATED',
      resource: 'Customer',
      resourceId: customer._id.toString(),
      details: `Customer ${cleanCustomerId} was created`,
      ipAddress: req.ip
    });

    res.status(201).json({ message: 'Customer created successfully', customer: await enrichCustomer(customer) });
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const filter = (!isAdmin && req.user?.userId) ? { user: req.user.userId } : {};
    const customers = await Customer.find(filter).sort({ updatedAt: -1 }).lean();
    const ids = customers.map(c => c._id);
    const [features, predictions] = await Promise.all([CustomerFeature.find({ customer: { $in: ids } }).lean(), CustomerPrediction.find({ customer: { $in: ids } }).lean()]);
    const featureMap = new Map(features.map(v => [String(v.customer), v]));
    const predictionMap = new Map(predictions.map(v => [String(v.customer), v]));
    const enriched = await Promise.all(customers.map(c => enrichCustomer(c, [featureMap.get(String(c._id)), predictionMap.get(String(c._id))])));
    res.json({ count: enriched.length, customers: enriched });
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const filter = { customerId: String(req.params.id).trim() };
    if (!isAdmin && req.user?.userId) {
      filter.user = req.user.userId;
    }
    const customer = await Customer.findOne(filter);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const enriched = await enrichCustomer(customer);
    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

const importCustomers = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'CSV file is required' });
    const result = await runImport(req.file.buffer, req.user.userId);
    if (result.rowsApplied) await createAuditLog({userId:req.user.userId, action:'CUSTOMERS_IMPORTED',resource:'Customer',details:`${result.rowsApplied} rows applied; ${result.rowsSkipped} skipped; ${result.rowsFailed} rejected`,ipAddress:req.ip});
    res.status(result.completion === 'rejected' ? 200 : 201).json({
      ...result,
      message: result.completion === 'complete' ? 'Import complete' : result.completion === 'partial' ? 'Import completed with rows requiring review' : 'No rows imported; review the reported issues',
      importedCustomers:result.customersCreated+result.customersUpdated
    });
  } catch (error) {
    if (error.importIndexSetup) return res.status(503).json({message:error.message});
    if (error.hasErrorLabel?.('UnknownTransactionCommitResult')) return res.status(503).json({message:'Import outcome could not be confirmed. Retrying the same file is safe; check the results before making further corrections.'});
    if (error.code === 11000) {
      // Do not log the duplicate value, raw query, or customer record.
      const detail=error.message?.match(/collection:\s+([\w.\-]+)\s+index:\s+([\w.\-]+)\s+dup key/i);
      const keyFields=Object.keys(error.keyPattern||error.errorResponse?.keyPattern||{});
      console.error('CSV unique constraint conflict',JSON.stringify({code:11000,collection:detail?.[1],index:detail?.[2],keyFields}));
      return res.status(409).json({message:'A database uniqueness constraint blocked the import. No transaction changes were committed by this request. Ask the administrator to review the import indexes.'});
    }
    next(error);
  }
};

module.exports = { createCustomer, getCustomers, getCustomer, importCustomers };
