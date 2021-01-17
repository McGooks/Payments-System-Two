const mongoose = require("mongoose");
const role = ["user", "admin", "modOwner", "schoolMgmt", "clerical", "adhoc"];
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
  QUBID: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: role,
    required: true,
    default: "user",
  },
  status: {
    type: String,
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
