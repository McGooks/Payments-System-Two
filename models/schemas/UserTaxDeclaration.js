const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const section1Res = ["A", "B", "C"];
const section2Res12 = ["1", "2"];

const UserTaxSchema = Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  employeeStatements_section1: {
    type: String,
    enum: section1Res,
    default: "A"
  },
  employeeStatements_section2: {
    type: String,
    enum: section2Res12,
    default: "1"
  },
  employeeStatements_section3q1: {
    type: String,
    default: "false"
  },
  employeeStatements_section3q2: {
    type: String,
    default: "false"
  },
  employeeStatements_section3q3: {
    type: String,
    default: "false"
  },
  employeeStatements_section3q4: {
    type: String,
    enum: section2Res12,
    default: "1"
  },
  employeeStatements_section3q5: {
    type: String,
    default: "false"
  },
  signed: {
    type: Boolean,
    default: false
  },
  signedDate: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = UserTaxSchema;
