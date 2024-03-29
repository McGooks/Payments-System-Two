import { Schema, model } from "mongoose";


const PaymentsSchema = new Schema({
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
    required: true,
  },
  projectCode: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
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
  cohort_id: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "On Hold"],
    default: "Pending",
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
  notes: {
    type: Schema.Types.ObjectId,
    ref: "notes",
  }
});

const Payments = model("payments", PaymentsSchema);
export default Payments;
