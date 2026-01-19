import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  getInbox,
  getMessages,
  markConversationSeen,
} from "../controllers/message.controllers.js";

const router = express.Router();

/**
 * Inbox (chat list)
 */
router.get("/inbox", authenticate, getInbox);

/**
 * Get messages of a conversation
 */
router.get("/:conversationId", authenticate, getMessages);

/**
 * Mark conversation as seen
 */
router.post("/:conversationId/seen", authenticate, markConversationSeen);

export default router;
