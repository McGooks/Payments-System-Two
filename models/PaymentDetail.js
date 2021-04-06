const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentDetailSchema = Schema({
  paymentCalc: {
    type: Object
  },
  markingCalc: {
    type: Array
  },
  officeHours: {
    type: Array
  },
  addedByUserDate: {
    type: Date,
    default: Date.now,
  },
  addedByUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  updatedByUserDate: {
    type: Date,
    default: Date.now,
  },
  updatedByUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const PaymentDetail = mongoose.model("paymentDetail", PaymentDetailSchema);
module.exports = PaymentDetail;
