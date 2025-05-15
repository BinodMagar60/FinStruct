// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    createdDate: { type: Date, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedBy: { type: String, required: true },
    requestedById: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    approvedById: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    approvedBy: { type: String },
    approvedDate: {type: Date, default: null}
  },
);

module.exports = mongoose.model("Transaction", transactionSchema);
