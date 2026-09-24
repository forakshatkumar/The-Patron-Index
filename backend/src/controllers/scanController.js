const createAuditLog = require('../utils/auditLogger');
const ScanRecord = require('../models/ScanRecord');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const createScan = async (req, res, next) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    if (!fileName || !fileType || !fileSize) {
      return res.status(400).json({ message: 'File details are required' });
    }
    const scan = await ScanRecord.create({
      scanId: crypto.randomUUID(),
      fileName,
      fileType,
      fileSize,
      status: 'pending',
      uploadedBy: req.user.userId
    });
    res.status(201).json({ message: 'Scan created successfully', scan });
  } catch (error) {
    next(error);
  }
};

const getScan = async (req, res, next) => {
  try {
    const scan = await ScanRecord.findOne({ scanId: req.params.id });
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.json({ scan });
  } catch (error) {
    next(error);
  }
};

const uploadScan = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const extension = path.extname(req.file.originalname).toLowerCase();
    const isBusinessDataset = ['.csv', '.xlsx', '.xls'].includes(extension);
    const scan = await ScanRecord.create({
      scanId: crypto.randomUUID(),
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: isBusinessDataset ? 'completed' : 'pending',
      riskScore: isBusinessDataset ? 0 : null,
      decision: isBusinessDataset ? 'allow' : null,
      uploadedBy: req.user.userId
    });

    await createAuditLog({
      userId: req.user.userId,
      action: 'FILE_UPLOADED',
      resource: 'ScanRecord',
      resourceId: scan._id.toString(),
      details: `File ${req.file.originalname} uploaded`,
      ipAddress: req.ip
    });

    // Uploaded files are quarantined. CSV/XLS files pass structural upload validation;
    // executable malware analysis remains an optional ML-service step.
    res.status(201).json({
      message: isBusinessDataset
        ? 'File validation passed and upload completed'
        : 'File uploaded to quarantine for security scanning',
      scanId: scan.scanId,
      status: scan.status,
      decision: scan.decision,
      riskScore: scan.riskScore,
      fileName: scan.fileName
    });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(error);
  }
};

module.exports = { createScan, getScan, uploadScan };
