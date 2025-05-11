const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  isMainSubtask: { type: Boolean, default: false }
});

module.exports = SubtaskSchema;
