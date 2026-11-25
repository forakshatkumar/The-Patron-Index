const createAuditLog = require('../utils/auditLogger');
const ScanRecord = require('../models/ScanRecord');
const crypto = require('crypto');
const path = require('path');


/**
 * Perform asynchronous heuristic static analysis or ML risk prediction
 */
async function queryMlService(buffer, originalName) {
  if (!process.env.MALWARE_SCAN_URL) return null;
  try {
    const data = new FormData();
    data.append('file', new Blob([buffer]), originalName);
    const response = await fetch(new URL('/predict', process.env.MALWARE_SCAN_URL), { method: 'POST', body: data, signal: AbortSignal.timeout(15000) });
    if (!response.ok) return null;
    const parsed = await response.json();
    if (!['REVIEW','ALLOW'].includes(parsed.verdict) || !Number.isFinite(parsed.risk_probability)) return null;
    return { riskScore: Math.round(parsed.risk_probability * 100), decision: parsed.verdict === 'REVIEW' ? 'review' : 'allow' };
  } catch { return null; }
}

const createScan = async (req, res, next) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    if (!fileName || !fileType || !fileSize) {
      return res.status(400).json({ message: 'File details are required' });
    }
    const cleanName = path.basename(String(fileName));
    const scan = await ScanRecord.create({
      scanId: crypto.randomUUID(),
      fileName: cleanName,
      fileType: String(fileType),
      fileSize: Number(fileSize),
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
    const scan = await ScanRecord.findOne({ scanId: String(req.params.id), uploadedBy: req.user.userId });
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.json({ scan });
  } catch (error) {
    next(error);
  }
};

const uploadScan = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    // Sanitize file path to eliminate directory traversal
    const safeFileName = path.basename(req.file.originalname);
    const extension = path.extname(safeFileName).toLowerCase();
    const isBusinessDataset = ['.csv', '.xlsx', '.xls'].includes(extension);

    // Initial scan record
    const scan = await ScanRecord.create({
      scanId: crypto.randomUUID(),
      fileName: safeFileName,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: isBusinessDataset ? 'completed' : 'scanning',
      riskScore: null,
      decision: isBusinessDataset ? 'allow' : null,
      uploadedBy: req.user.userId
    });

    await createAuditLog({
      userId: req.user.userId,
      action: 'FILE_UPLOADED',
      resource: 'ScanRecord',
      resourceId: scan._id.toString(),
      details: `File ${safeFileName} received for validation`,
      ipAddress: req.ip
    });

    if (!isBusinessDataset) {
      // Asynchronously invoke ML scanner or heuristic fallback
      const mlResult = await queryMlService(req.file.buffer, safeFileName);
      if (mlResult) {
        scan.status = 'completed';
        scan.riskScore = mlResult.riskScore;
        scan.decision = mlResult.decision;
        await scan.save();
      } else {
        scan.status = 'completed';
        scan.riskScore = null;
        scan.decision = 'review';
        await scan.save();
      }
    }

    res.status(201).json({
      message: isBusinessDataset
        ? 'Dataset received; row validation occurs during CSV import'
        : 'File received; review the scan decision',
      scanId: scan.scanId,
      status: scan.status,
      decision: scan.decision,
      riskScore: scan.riskScore,
      fileName: scan.fileName
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createScan, getScan, uploadScan };
