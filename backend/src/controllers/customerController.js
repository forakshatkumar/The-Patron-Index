const Customer = require('../models/Customer');
const CustomerFeature = require('../models/CustomerFeature');
const CustomerPrediction = require('../models/CustomerPrediction');
const createAuditLog = require('../utils/auditLogger');
const {
  calculatePatronIndex,
  classifyCustomer,
  recommendationFor,
  customerStatus
} = require('../utils/customerScoring');

function daysSince(dateValue) {
  if (!dateValue) return 0;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 0;
  const now = new Date();
  return Math.max(0, Math.floor((now - date) / 86400000));
}

function parseCsv(text) {
  const lines = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(line => line.trim());

  if (lines.length < 2) throw new Error('CSV file must contain a header and at least one data row');

  const splitLine = line => {
    const values = [];
    let current = '';
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (quoted && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === ',' && !quoted) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = splitLine(lines[0]).map(h => h.toLowerCase().trim());
  const required = ['customer_id', 'name', 'purchase_date', 'amount'];
  const missing = required.filter(key => !headers.includes(key));
  if (missing.length) throw new Error(`Missing required columns: ${missing.join(', ')}`);

  return lines.slice(1).map(line => {
    const values = splitLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

async function enrichCustomer(customer) {
  const [features, prediction] = await Promise.all([
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
      atRiskProbability: prediction?.atRiskProbability ?? (segment === 'At-Risk' ? 0.75 : 0.1),
      recommendation: prediction?.recommendation || recommendationFor(segment),
      modelVersion: prediction?.modelVersion || 'rfm-v1'
    },
    status: customerStatus(segment)
  };
}

const createCustomer = async (req, res, next) => {
  try {
    const { customerId, name, email, totalSpent = 0, totalOrders = 0 } = req.body;
    if (!customerId || !name || !email) {
      return res.status(400).json({ message: 'customerId, name and email are required' });
    }

    const existingCustomer = await Customer.findOne({ customerId });
    if (existingCustomer) return res.status(409).json({ message: 'Customer already exists' });

    const customer = await Customer.create({ customerId, name, email, totalSpent, totalOrders });
    const features = {
      recency: 0,
      frequency: Number(totalOrders || 0),
      monetary: Number(totalSpent || 0),
      averageOrderValue: totalOrders ? Number((totalSpent / totalOrders).toFixed(2)) : 0
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
      details: `Customer ${customerId} was created`,
      ipAddress: req.ip
    });

    res.status(201).json({ message: 'Customer created successfully', customer: await enrichCustomer(customer) });
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ updatedAt: -1 });
    const enriched = await Promise.all(customers.map(enrichCustomer));
    res.json({ count: enriched.length, customers: enriched });
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.id });
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

    const rows = parseCsv(req.file.buffer.toString('utf8'));
    const grouped = new Map();

    for (const row of rows) {
      const id = String(row.customer_id || '').trim();
      if (!id) continue;
      const amount = Number(row.amount || 0);
      const current = grouped.get(id) || {
        customerId: id,
        name: row.name || id,
        email: row.email || `${id.toLowerCase().replace(/[^a-z0-9]/g, '')}@patron.local`,
        totalSpent: 0,
        totalOrders: 0,
        latestPurchase: null
      };
      current.totalSpent += Number.isFinite(amount) ? amount : 0;
      current.totalOrders += 1;
      const purchaseDate = new Date(row.purchase_date);
      if (!Number.isNaN(purchaseDate.getTime()) && (!current.latestPurchase || purchaseDate > current.latestPurchase)) {
        current.latestPurchase = purchaseDate;
      }
      grouped.set(id, current);
    }

    let imported = 0;
    for (const item of grouped.values()) {
      const customer = await Customer.findOneAndUpdate(
        { customerId: item.customerId },
        {
          customerId: item.customerId,
          name: item.name,
          email: item.email,
          totalSpent: Number(item.totalSpent.toFixed(2)),
          totalOrders: item.totalOrders
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
          atRiskProbability: segment === 'At-Risk' ? 0.75 : segment === 'Inactive' ? 0.9 : 0.1,
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
  }
};

module.exports = { createCustomer, getCustomers, getCustomer, importCustomers };
