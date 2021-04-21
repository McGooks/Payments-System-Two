const mongoose = require("mongoose");
const AddressSchema = require("./schemas/Address")
const BankSchema = require("./schemas/Bank")
const ContactDetailsSchema = require("./schemas/ContactDetails")
const UserTaxDeclarationSchema = require("./schemas/UserTaxDeclaration")

const role = [
  "User",
  "Admin",
  "Module Owner",
  "School Management",
  "Clerical",
  "Adhoc",
];
const status = ["Pending", "Active", "Disabled", "Expired"];
const titlesArray = ["Mr", "Mrs", "Miss", "Dr", "Ms", "Prof"];
const UserSchema = mongoose.Schema({
  address: [AddressSchema],
  bank: [BankSchema],
  contact: [ContactDetailsSchema],
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
  key: {
    type: String,
  },
  dob: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailTokenIssued: {
    type: Date,
  },
  emailTokenExpiry: {
    type: Date,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifiedDate: {
    type: Date,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  nino: {
    type: String,
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
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  pronoun: {
    type: String,
  },
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payments",
    },
  ],
  QUBID: {
    type: Number,
    required: true,
    unique: true,
  },
  NSPID: {
    type: Number,
    unique: true
  },
  qubSchool: {
    type: String,
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
    default: "Pending",
  },
  title: {
    type: String,
    enum: titlesArray,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  taxDeclaration: [UserTaxDeclarationSchema],
});

UserSchema.virtual("Name").get(function () {
  return this.firstName + " " + this.lastName;
});

function convertSecsToMs(d) {
  if (!d || !isValidTimestamp(d)) return;

  return new Date(d * 1000);
}

function isValidTimestamp(date) {
  return new Date(date).getTime() > 0;
}

UserSchema.pre("remove", function (next) {
  const Payments = mongoose.model("payments");
  Payments.remove({ _id: { $in: this.payments } }).then(() => next()); //iterates through the payments and finds all ID's "in" the model and removes
});

const User = mongoose.model("user", UserSchema);
module.exports = User
