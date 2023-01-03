import { connect } from "mongoose";
import { get } from "config";
const db = get("mongoURI");

const connectDB = async () => {
  try {
    await connect(db).then(() => {
      console.log("Success, Mongo DB connected");
    });

  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;