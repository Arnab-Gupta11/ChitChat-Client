import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
  },
  { timestamps: true }
);

//encrypt password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// check password is same or not
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//generate jwt token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    //Payload
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    //Access token
    process.env.ACCESS_TOKEN_SECRET,
    //Token expiry time
    {
      expiresIn: process.env.ACESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
