import express from "express";
import { accessChat, fetchChats } from "../controllers/chat.controllers.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
const router = express.Router();

router.route("/").post(verifyToken, accessChat).get(verifyToken, fetchChats);

export default router;
