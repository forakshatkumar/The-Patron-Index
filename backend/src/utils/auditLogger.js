const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    userId,
    action,
    resource = "",
    resourceId = "",
    details = "",
    ipAddress = ""
}) => {
    try {
        await AuditLog.create({
            user: userId,
            action,
            resource,
            resourceId,
            details,
            ipAddress
        });
    } catch (error) {
        console.error("Audit log error:", error.message);
    }
};

module.exports = createAuditLog;