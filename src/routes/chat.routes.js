import express from "express";
import { accessChat, createGroupChat, fetchChats } from "../controllers/chat.controllers.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
const router = express.Router();

router.route("/").post(verifyToken, accessChat).get(verifyToken, fetchChats);

router.route("/group").post(verifyToken, createGroupChat);

export default router;
