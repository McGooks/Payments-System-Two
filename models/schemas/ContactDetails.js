import { Schema} from "mongoose";

const ContactDetailsSchema = new Schema({
  mobile: {
    type: String,
    default: ""
  },
  landline: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default ContactDetailsSchema;
