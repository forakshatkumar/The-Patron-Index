const mongoose = require("mongoose");

const scanRecordSchema = new mongoose.Schema(
    {
        scanId: {
            type: String,
            required: true,
            unique: true
        },

        fileName: {
            type: String,
            required: true
        },

        fileType: {
            type: String,
            required: true
        },

        fileSize: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "scanning", "completed", "failed"],
            default: "pending"
        },

        riskScore: {
            type: Number,
            default: null
        },

        decision: {
            type: String,
            enum: ["allow", "review", "block"],
            default: null
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ScanRecord", scanRecordSchema);