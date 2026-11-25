const Role = require('../models/Role');

class RoleRepository {
  async findByName(name) {
    return await Role.findOne({ name }).populate('permissions');
  }
  
  async findById(id) {
    return await Role.findById(id).populate('permissions');
  }
}

module.exports = new RoleRepository();
