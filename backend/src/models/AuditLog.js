const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            required: true,
            trim: true
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

module.exports = mongoose.model("AuditLog", auditLogSchema);