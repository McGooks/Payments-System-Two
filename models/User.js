const mongoose = require("mongoose");
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
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    county: {
      type: String,
    },
    country: {
      type: String,
    },
    postcode: {
      type: String,
    },
  },
  bank: {
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
    sortCode: {
      type: Number,
      min: 100000,
      max: 999999,
    },
    accNumber: {
      type: Number,
      min: 10000000,
      max: 99999999,
    },
    buildingSocietyNumber: {
      type: Number,
    },
  },
  contact: {
    mobile: {
      type: String,
    },
    landline: {
      type: String,
    },
  },
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
    set: (d) => convertSecsToMs(d),
  },
  emailTokenExpiry: {
    type: Date,
    set: (d) => convertSecsToMs(d),
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
  UserNSPID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserNSPDetails",
  },
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

module.exports = mongoose.model("user", UserSchema);
