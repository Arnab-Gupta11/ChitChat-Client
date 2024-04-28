import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // console.log(decode);
    req.user = await User.findById(decode._id).select("-password");
    next();
  } catch (error) {
    console.log(`Error from verifyToken: ${error.message}`);
  }
};
export { verifyToken };
