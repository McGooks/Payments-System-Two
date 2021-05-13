const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactDetailsSchema = Schema({
  mobile: {
    type: String,
    default: ""
  },
  landline: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = ContactDetailsSchema;
