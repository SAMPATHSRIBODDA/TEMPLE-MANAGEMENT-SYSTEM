const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked if they have system access
  
  employeeCode: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  designation: { type: String, required: true }, // 'Priest', 'Guard', 'Clerk'
  department: { type: String },
  
  joiningDate: { type: Date, required: true },
  baseSalary: { type: Number, required: true },
  
  contactDetails: {
    phone: String,
    email: String,
    address: String
  },
  
  status: { type: String, enum: ['active', 'on_leave', 'terminated'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
