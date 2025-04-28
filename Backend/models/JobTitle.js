const mongoose = require('mongoose');

const jobTitleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role: { type: String, enum: ['user', 'worker'], required: true },
  titleName: { type: String },
  defaultSalary: { type: Number},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobTitle', jobTitleSchema);
