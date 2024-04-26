import mongoose from "mongoose";
// import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MongoDB connected!! host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection Failed!!", error.message);
    process.exit(1);
  }
};
export default connectDB;
