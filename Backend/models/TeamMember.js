const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  initials: { type: String, required: true }
});

module.exports = TeamMemberSchema;
