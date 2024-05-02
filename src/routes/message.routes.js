import express from "express";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { allMessage, sendMessage } from "../controllers/message.controllers.js";
const router = express.Router();

router.route("/").post(verifyToken, sendMessage);
router.route("/:chatId").get(verifyToken, allMessage);

export default router;
