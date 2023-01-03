import { Schema } from "mongoose";


const UserTaxSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  employeeStatements_section1: {
    type: String,
    default: ""
  },
  employeeStatements_section2: {
    type: String,
    default: ""
  },
  employeeStatements_section3q1: {
    type: String,
    default: ""
  },
  employeeStatements_section3q2: {
    type: String,
    default: ""
  },
  employeeStatements_section3q3: {
    type: String,
    default: ""
  },
  employeeStatements_section3q4: {
    type: String,
    default: ""
  },
  employeeStatements_section3q5: {
    type: String,
    default: ""
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

export default UserTaxSchema;
