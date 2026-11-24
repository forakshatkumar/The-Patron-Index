const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        action: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        resource: {
            type: String,
            default: ""
        },

        resourceId: {
            type: String,
            default: ""
        },

        details: {
            type: String,
            default: ""
        },

        ipAddress: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
