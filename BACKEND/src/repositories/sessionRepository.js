const Session = require('../models/Session');

class SessionRepository {
  async createSession(userId, refreshToken, ip, userAgent, expiresInDays = 7) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return await Session.create({
      userId,
      refreshToken,
      deviceInfo: { ip, userAgent },
      expiresAt
    });
  }

  async findValidSession(refreshToken) {
    return await Session.findOne({ refreshToken, isValid: true }).populate('userId');
  }

  async invalidateSession(refreshToken) {
    return await Session.findOneAndUpdate({ refreshToken }, { isValid: false });
  }
  
  async invalidateAllUserSessions(userId) {
    return await Session.updateMany({ userId }, { isValid: false });
  }
}

module.exports = new SessionRepository();
