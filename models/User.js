const mongoose = require("mongoose");
const role = ["User", "Admin", "Module Owner", "School Management", "Clerical", "Adhoc"];
const status = ["Pending", "Active", "Disabled", "Expired"]
const UserSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  deletedAt: {
    type: Date,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dob: {
    type: Date,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerificationToken: {
    type: String,
    default: "",
  },
  emailVerificationTokenExpiresAt: {
    type: Date,
    default: "",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  userImg: {
    data: Buffer,
    contentType: String,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
    default: "",
  },
  passwordResetTokenExpiresAt: {
    type: Date,
    default: "",
  },
  payment: {
    type: Number,
  },
  payment1: {
    type: Number,
  },
  QUBID: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: role,
    required: true,
    default: "User",
  },
  status: {
    type: String,
    enum: status,
    default: "Pending"
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

UserSchema.virtual('Name').get(function () {
  return this.firstName + ' ' + this.lastName ;
});

module.exports = mongoose.model("user", UserSchema);
