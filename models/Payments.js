const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PaymentsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  QUBID: {
    type: Number,
    required: true,
  },
  account: {
    type: Number,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  subanalysis: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  student_cohort: {
    type: Boolean,
    required: true,
  },
  cohort_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: "import",
  },
  addedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

PaymentsSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model("payments", PaymentsSchema);
