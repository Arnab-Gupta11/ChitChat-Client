import express from "express";
import { registerUser, loginUser, allUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
const router = express.Router();

router.route("/").post(registerUser).get(verifyToken, allUser);
router.route("/login").post(loginUser);

export default router;
