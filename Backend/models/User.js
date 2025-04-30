const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  personalEmail: {type: String, default: ""},
  phoneNumber: {type: Number, default: ""},
  location: {type: String, default: ""},
  salt: {type: String},
  email: { type: String},
  password: { type: String},
  bio: { type: String, default: ""},
  isOwner: {type: Boolean, default: false},
  role: { type: String, enum: ['admin','employee', 'worker'], required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobTitleId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobTitle' },
  photo: { type: String, default: "" },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
  lastLogout: {type: Date, default: null },
  lastLogin: { type: Date, default: null },
  salary: {type: Number, required: true}
},{
    timestamps: true
});

// module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.models.User || mongoose.model('User', userSchema);

