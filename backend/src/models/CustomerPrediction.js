const mongoose = require('mongoose');

const customerPredictionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      unique: true,
      index: true
    },
    segment: { type: String, default: null, index: true },
    patronIndex: { type: Number, default: 0, index: true },
    atRiskProbability: { type: Number, default: null },
    recommendation: { type: String, default: '' },
    modelVersion: { type: String, default: 'rfm-v1' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomerPrediction', customerPredictionSchema);
