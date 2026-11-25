const AuditLog = require('../models/AuditLog');

class AuditRepository {
  async logAction(userId, action, resource, resourceId, details, ipAddress, userAgent) {
    return await AuditLog.create({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent
    });
  }
}

module.exports = new AuditRepository();
