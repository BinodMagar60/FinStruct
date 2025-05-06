const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema( {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  companyId: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
  name: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  size: {
    type: String,  
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now, 
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
