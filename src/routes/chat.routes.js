import express from "express";
import {
  accessChat,
  addMemberToGroup,
  createGroupChat,
  fetchChats,
  removeMemberFromGroup,
  renameGroupName,
} from "../controllers/chat.controllers.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
const router = express.Router();

router.route("/").post(verifyToken, accessChat).get(verifyToken, fetchChats);

router.route("/group").post(verifyToken, createGroupChat);
router.route("/rename-group").put(verifyToken, renameGroupName);
router.route("/add-group-member").put(verifyToken, addMemberToGroup);
router.route("/remove-group-member").put(verifyToken, removeMemberFromGroup);

export default router;
