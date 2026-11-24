const mongoose = require("mongoose");

const scanRecordSchema = new mongoose.Schema(
    {
        scanId: {
            type: String,
            required: true,
            unique: true,
            index: true
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
            default: "pending",
            index: true
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
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

scanRecordSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ScanRecord", scanRecordSchema);
