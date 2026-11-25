const mongoose = require('mongoose');

const salaryRecordSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentDate: { type: Date },
  paymentMethod: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SalaryRecord', salaryRecordSchema);
