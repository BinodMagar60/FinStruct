const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = AssetSchema;
