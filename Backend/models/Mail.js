const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  subject: {type: String, requried},
  description: {type: String, required},
  from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required},
  to: {type: String, required},
  date: {type: Date, required},
  isRead: {type: Boolean, required},
  isSent: {type: Boolean, required},
});

module.exports = mongoose.model('Expense', expenseSchema);
