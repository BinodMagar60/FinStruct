const mongoose = require('mongoose');

const ActivitySchema = require('./Activity');
const AssetSchema = require('./Asset');
const SubtaskSchema = require('./Subtask');
const TeamMemberSchema = require('./TeamMember');

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  title: { type: String, required: true },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  startingDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['TO DO', 'IN PROGRESS', 'COMPLETED', 'ON HOLD'], default: 'TO DO' },
  stage: { type: String, default: 'todo' },
  createdAt: { type: Date, default: Date.now },

  assignees: [{ type: String, required: true }],
  dependencies: [{ type: String }],

  subtasks: [SubtaskSchema],
  assets: [AssetSchema],
  activities: [ActivitySchema],
  team: [TeamMemberSchema]
});

module.exports = mongoose.model('Task', TaskSchema);
