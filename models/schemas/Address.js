import { Schema } from "mongoose";



const AddressSchema = new Schema({
  street: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  county: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  postcode: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedById: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

export default AddressSchema;
