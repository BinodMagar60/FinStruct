const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  projectName: { type: String, required: true },
  creatorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  description: { type: String },
  dueDate: {type: Date, required: true}
},{
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
