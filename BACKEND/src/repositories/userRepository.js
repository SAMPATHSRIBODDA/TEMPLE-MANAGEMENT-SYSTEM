const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmailOrPhone(email, phone) {
    return await User.findOne({ $or: [{ email }, { phone }] }).populate('role');
  }

  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password').populate('role');
  }

  async findById(id) {
    return await User.findById(id).populate('role');
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async incrementFailedAttempts(user) {
    user.failedLoginAttempts += 1;
    // Lock for 15 minutes if 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.status = 'locked';
      user.lockUntil = Date.now() + 15 * 60 * 1000;
    }
    await user.save();
    return user;
  }

  async resetFailedAttempts(user) {
    user.failedLoginAttempts = 0;
    user.status = 'active';
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();
    return user;
  }
}

module.exports = new UserRepository();
