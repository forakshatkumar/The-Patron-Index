const mongoose = require("mongoose");

const threatPredictionSchema = new mongoose.Schema(
    {
        scanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ScanRecord",
            required: true
        },

        modelName: {
            type: String,
            required: true
        },

        prediction: {
            type: String,
            required: true
        },

        confidence: {
            type: Number,
            required: true
        },

        explanation: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ThreatPrediction",
    threatPredictionSchema
);