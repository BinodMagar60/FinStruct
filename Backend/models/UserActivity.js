const mongoose = require('mongoose');


const userActivitySchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['login', 'profile_update', 'document', 'transaction', 'user', 'other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserActivity', userActivitySchema);
