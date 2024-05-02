import express from "express";
import { accessChat, createGroupChat, fetchChats, renameGroupName } from "../controllers/chat.controllers.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
const router = express.Router();

router.route("/").post(verifyToken, accessChat).get(verifyToken, fetchChats);

router.route("/group").post(verifyToken, createGroupChat);
router.route("/rename-group").put(verifyToken, renameGroupName);

export default router;
