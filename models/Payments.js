const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentsSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  deliveredBy: {
    type: String,
    required: true,
    enum: ["TA", "PGTA"], // this needs to be added to settings
  },
  school: {
    type: String,
  },
  academicYear: {
    type: String,
    enum: ["2020/2021", "2021/2022", "2022/2023"], // this needs to be added to settings
  },
  paymentPeriod: {
    type: String,
  },
  paymentPeriodNum: {
    type: Number,
  },
  semester: {
    type: String,
  },
  QUBID: {
    type: Number,
    required: true,
  },
  account: {
    type: Number,
  },
  projectCode: {
    type: String,
  },
  projectName: {
    type: String,
  },
  subAnalysis: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  student_cohort: {
    type: Boolean,
    required: true,
    default: true,
  },
  rate1: {
    type: Number
  },
  rate2: {
    type: Number
  },
  grade1: {
    type: String
  },
  grade2: {
    type: String
  },
  cohort_id: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "On Hold", "Paid"],
    default: "Pending",
  },
  paymentDetail: {
    type: Schema.Types.ObjectId,
    ref: "paymentDetail",
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
  // notes: {
  //   type: Schema.Types.ObjectId,
  //   ref: "notes",
  // }
});

// PaymentsSchema.pre("remove", function (next) {
//   const PaymentDetail = mongoose.model("paymentDetail");
//   PaymentDetail.remove({ _id: { $in: this.paymentDetail } }).then(() => next()); //iterates through the payments and finds all ID's "in" the model and removes
// });

const Payments = mongoose.model("payments", PaymentsSchema);
module.exports = Payments;
