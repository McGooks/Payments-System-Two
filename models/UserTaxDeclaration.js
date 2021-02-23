const mongoose = require("mongoose");

const section1Res = ["A", "B", "C"];
const section2Res = [1, 2];
const section3ResQ4 = [1, 2];

const UserTaxDeclarationSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  employeeStatements: {
    section1: {
      type: String,
      required: true,
      enum: section1Res,
    },
    section2: {
      type: Number,
      required: true,
      enum: section2Res,
    },
    section3: {
      q1: {
        type: Boolean,
      },
      q2: {
        type: Boolean,
      },
      q3: {
        type: Boolean,
      },
      q4: {
        type: Number,
        enum: section3ResQ4,
      },
      q5: {
        type: Boolean,
      },
    },
  },
  signed: {
    type: Boolean,
    required: true,
  },
  signedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  signedDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserTaxDeclaration", UserTaxDeclarationSchema);

