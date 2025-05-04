const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now, required: true },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model('Mail', mailSchema);
