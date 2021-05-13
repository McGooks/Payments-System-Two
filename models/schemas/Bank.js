const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const BankSchema = Schema({
  bankName: {
    type: String,
    default: ""
  },
  branchName: {
    type: String,
    default: ""
  },
  sortCode: {
    type: Number,
    min: 100000,
    max: 999999,
    default: ""
  },
  accNumber: {
    type: Number,
    min: 10000000,
    max: 99999999,
    default: ""
  },
  buildingSocietyNumber: {
    type: Number,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedById: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = BankSchema
