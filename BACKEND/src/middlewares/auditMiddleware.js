const AuditLog = require('../models/AuditLog');

const logAudit = async (req, action, resource, resourceId, details) => {
  try {
    const auditLog = new AuditLog({
      userId: req.user ? req.user._id : null,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });
    await auditLog.save();
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

module.exports = { logAudit };
