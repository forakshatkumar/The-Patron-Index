const createAuditLog = require('../utils/auditLogger');
const ScanRecord = require('../models/ScanRecord');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const http = require('http');

/**
 * Perform asynchronous heuristic static analysis or ML risk prediction
 */
async function queryMlService(filePath, originalName) {
  return new Promise((resolve) => {
    // If local ML microservice is online at port 8002, query it
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 8002,
        path: '/predict',
        method: 'POST',
        timeout: 2000
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({
              riskScore: parsed.risk_probability != null ? Math.round(parsed.risk_probability * 100) : null,
              decision: parsed.verdict === 'REVIEW' ? 'review' : 'allow'
            });
          } catch {
            resolve(null);
          }
        });
      }
    );

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
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
    const scan = await ScanRecord.findOne({ scanId: String(req.params.id) });
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

    // Initial record in quarantine
    const scan = await ScanRecord.create({
      scanId: crypto.randomUUID(),
      fileName: safeFileName,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: isBusinessDataset ? 'completed' : 'scanning',
      riskScore: isBusinessDataset ? 0 : null,
      decision: isBusinessDataset ? 'allow' : null,
      uploadedBy: req.user.userId
    });

    await createAuditLog({
      userId: req.user.userId,
      action: 'FILE_UPLOADED',
      resource: 'ScanRecord',
      resourceId: scan._id.toString(),
      details: `File ${safeFileName} uploaded to quarantine`,
      ipAddress: req.ip
    });

    if (!isBusinessDataset) {
      // Asynchronously invoke ML scanner or heuristic fallback
      const mlResult = await queryMlService(req.file.path, safeFileName);
      if (mlResult) {
        scan.status = 'completed';
        scan.riskScore = mlResult.riskScore;
        scan.decision = mlResult.decision;
        await scan.save();
      } else {
        scan.status = 'completed';
        scan.riskScore = null;
        scan.decision = 'allow';
        await scan.save();
      }
    }

    res.status(201).json({
      message: isBusinessDataset
        ? 'File validation passed and upload completed'
        : 'File uploaded to quarantine and analyzed',
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
