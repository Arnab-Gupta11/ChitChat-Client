import express from "express";
import { accessChat } from "../controllers/chat.controllers.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
const router = express.Router();

router.route("/").post(verifyToken, accessChat);

export default router;
