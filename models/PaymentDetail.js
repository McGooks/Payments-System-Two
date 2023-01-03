import { Schema, model } from "mongoose";


const PaymentDetailSchema = new Schema({
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

const PaymentDetail = model("paymentDetail", PaymentDetailSchema);
export default PaymentDetail;
