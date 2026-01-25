import {
    getInboxService,
    getMessagesService,
    markConversationSeenService,
    sendMessageService,
  } from "../services/message.service.js";
  import Conversation from "../models/conversation.models.js";
  
  /**
   * GET /api/v1/messages/inbox
   * Get chat list (Inbox)
   */
  export const getInbox = async (req, res) => {
    try {
      const userId = req.user.sub;
  
      const inbox = await getInboxService(userId);
  
      res.status(200).json(inbox);
    } catch (err) {
      console.error("Inbox error:", err);
      res.status(500).json({ message: "Failed to load inbox" });
    }
  };
  
  /**
   * GET /api/v1/messages/:conversationId
   * Get messages of a conversation (cursor-based)
   */
  export const getMessages = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { cursor } = req.query;
      const userId = req.user.sub;
  
      // Authorization check (critical)
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      }).select("_id");
  
      if (!conversation) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      const messages = await getMessagesService(
        conversationId,
        cursor,
        userId
      );
  
      res.status(200).json(messages);
    } catch (err) {
      console.error("Get messages error:", err);
      res.status(500).json({ message: "Failed to load messages" });
    }
  };
  
  /**
   * POST /api/v1/messages/:conversationId/seen
   * Mark messages as seen
   */
  export const markConversationSeen = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.user.sub;
  
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      }).select("_id");
  
      if (!conversation) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      await markConversationSeenService(conversationId, userId);
  
      res.status(200).json({ status: "SEEN" });
    } catch (err) {
      console.error("Seen error:", err);
      res.status(500).json({ message: "Failed to mark as seen" });
    }
  };
  

  export const sendMessage = async (req, res) => {
    try {
      const from = req.user.sub;
      const { to, body } = req.body;
  
      if (!to || !body?.trim()) {
        return res.status(400).json({
          message: "Recipient and message body are required",
        });
      }
  
      const result = await sendMessageService({
        from,
        to,
        body,
      });
  
      res.status(201).json(result);
    } catch (err) {
      console.error("Send message error:", err);
      res.status(500).json({ message: "Failed to send message" });
    }
  };