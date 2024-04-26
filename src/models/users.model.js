import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      uniqe: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePhoto: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
