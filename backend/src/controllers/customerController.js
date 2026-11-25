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

const { parseCsv } = require('../utils/parseCsv');
const crypto = require('crypto');

function daysSince(dateValue) {
  if (!dateValue) return 0;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 0;
  const now = new Date();
  return Math.max(0, Math.floor((now - date) / 86400000));
}

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

const activeImports = new Set();
const importCustomers = async (req, res, next) => {
  const owner = req.user.userId;
  if (activeImports.has(owner)) return res.status(409).json({ message: 'An import is already running for your workspace. Try again after it completes.' });
  activeImports.add(owner);
  try {
    if (!req.file) return res.status(400).json({ message: 'CSV file is required' });

    const rows = parseCsv(req.file.buffer.toString('utf8'));
    const grouped = new Map();
    const fingerprint = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const operations = [];

    for (const [rowIndex, row] of rows.entries()) {
      const id = String(row.customer_id || '').trim();
      if (!id) continue;
      const amount = Number(row.amount || 0);
      const current = grouped.get(id) || {
        customerId: id,
        name: String(row.name || id).trim(),
        email: String(row.email || '').trim(),
        totalSpent: 0,
        totalOrders: 0,
        latestPurchase: null
      };
      if (row.email) current.email = String(row.email).trim();
      current.totalSpent += Number.isFinite(amount) ? amount : 0;
      current.totalOrders += 1;
      const purchaseDate = new Date(row.purchase_date);
      if (!Number.isNaN(purchaseDate.getTime()) && (!current.latestPurchase || purchaseDate > current.latestPurchase)) {
        current.latestPurchase = purchaseDate;
      }
      grouped.set(id, current);

      if (req.user?.userId && row.purchase_date && !Number.isNaN(purchaseDate.getTime()) && Number.isFinite(amount)) {
        const txnDate = purchaseDate.toISOString().split('T')[0];
        const txnId = String(row.transaction_id || `CSV-${fingerprint.slice(0,32)}-${rowIndex}`);
        const record = {
          transactionId: txnId, customerId: id, customerName: String(row.name).trim(), amount,
          date: txnDate, product: String(row.product || 'Not specified').trim(), category: String(row.category || 'Not specified').trim(),
          paymentMethod: String(row.payment_method || 'Not specified').trim(), status: 'Completed', source: 'transaction', user: req.user.userId
        };
        operations.push({ updateOne: { filter: { user: req.user.userId, transactionId: txnId }, update: { $setOnInsert: record }, upsert: true } });
      }
    }

    // Validate conflicting supplied transaction IDs before writing.
    const existing = await Transaction.find({ user: req.user.userId, transactionId: { $in: operations.map(o => o.updateOne.filter.transactionId) } }).lean();
    const byId = new Map(existing.map(t => [t.transactionId, t]));
    for (const op of operations) {
      const record = op.updateOne.update.$setOnInsert;
      const old = byId.get(record.transactionId);
      if (old && (old.customerId !== record.customerId || old.amount !== record.amount || old.date !== record.date)) return res.status(409).json({ message: `Transaction ID ${record.transactionId} already refers to a different purchase` });
    }
    if (operations.length) await Transaction.bulkWrite(operations, { ordered: true });
    const mongoose = require('mongoose');
    const totals = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.userId), customerId: { $in: [...grouped.keys()] }, source: { $ne: 'summary' }, product: { $ne: 'Direct Order' } } },
      { $group: { _id: '$customerId', totalSpent: { $sum: '$amount' }, totalOrders: { $sum: 1 }, latestPurchase: { $max: '$date' } } }
    ]);
    const history = new Map(totals.map(t => [t._id, t]));
    for (const item of grouped.values()) {
      const total = history.get(item.customerId);
      if (total) Object.assign(item, { totalSpent: total.totalSpent, totalOrders: total.totalOrders, latestPurchase: total.latestPurchase });
    }

    let imported = 0;
    for (const item of grouped.values()) {
      const customer = await Customer.findOneAndUpdate(
        { customerId: item.customerId, user: req.user?.userId },
        {
          $set: { customerId: item.customerId, name: item.name, ...(item.email ? { email: item.email } : {}), totalSpent: Number(item.totalSpent.toFixed(2)), totalOrders: item.totalOrders, user: req.user.userId },
          ...(item.email ? {} : { $setOnInsert: { email: `${item.customerId.toLowerCase().replace(/[^a-z0-9]/g, '') || 'customer'}@patron.local` } })
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const features = {
        recency: daysSince(item.latestPurchase),
        frequency: item.totalOrders,
        monetary: Number(item.totalSpent.toFixed(2)),
        averageOrderValue: item.totalOrders
          ? Number((item.totalSpent / item.totalOrders).toFixed(2))
          : 0
      };
      const patronIndex = calculatePatronIndex(features);
      const segment = classifyCustomer({ ...features, patronIndex });

      await CustomerFeature.findOneAndUpdate(
        { customer: customer._id },
        { customer: customer._id, ...features },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      await CustomerPrediction.findOneAndUpdate(
        { customer: customer._id },
        {
          customer: customer._id,
          segment,
          patronIndex,
          atRiskProbability: null,
          recommendation: recommendationFor(segment),
          modelVersion: 'rfm-v1'
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      imported += 1;
    }

    await createAuditLog({
      userId: req.user.userId,
      action: 'CUSTOMERS_IMPORTED',
      resource: 'Customer',
      details: `${imported} customers imported from ${req.file.originalname}`,
      ipAddress: req.ip
    });

    res.status(201).json({
      message: 'Customer data imported and classified successfully',
      importedCustomers: imported,
      processedRows: rows.length
    });
  } catch (error) {
    next(error);
  } finally { activeImports.delete(owner); }
};

module.exports = { createCustomer, getCustomers, getCustomer, importCustomers };
