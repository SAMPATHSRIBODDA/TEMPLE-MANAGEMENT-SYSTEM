const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'half_day', 'leave'], required: true },
  
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
