import {
    findOrCreateConversation,
    getInboxByUser,
    resetUnreadCount,
  } from "../repositories/conversation.repository.js";
  import {
    createMessage,
    getMessagesByConversation,
    markMessagesAsSeen,
  } from "../repositories/message.repository.js";
  import Conversation from "../models/conversation.models.js";
  import Message from "../models/message.models.js"
  
  /**
   * Get inbox (chat list)
   */
  export const getInboxService = async (userId) => {
    return getInboxByUser(userId);
  };
  
  /**
   * Get messages with pagination
   */
  export const getMessagesService = async (conversationId, cursor, userId) => {
    // Reset unread count when user opens chat
    await resetUnreadCount(conversationId, userId);
  
    const messages = await getMessagesByConversation(
      conversationId,
      cursor
    );
  
    return messages.reverse();
  };
  
  /**
   * Send message (atomic, scalable)
   */
  export const sendMessageService = async ({ from, to, body }) => {
    const conversation = await findOrCreateConversation(from, to);
  
    const message = await createMessage({
      conversationId: conversation._id,
      senderId: from,
      body,
      status: "SENT",
    });
  
    await Conversation.updateOne(
      { _id: conversation._id },
      {
        $set: {
          lastMessage: {
            text: body,
            sender: from,
            createdAt: message.createdAt,
          },
        },
        $inc: { [`unreadCounts.${to}`]: 1 },
      }
    );
  
    return { conversationId: conversation._id, message };
  };
  
  /**
   * Mark conversation as seen
   */
  export const markConversationSeenService = async (
    conversationId,
    userId
  ) => {
    // Mark messages as SEEN
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        status: { $ne: "SEEN" },
      },
      { $set: { status: "SEEN" } }
    );
  
    // Reset unread count
    await Conversation.updateOne(
      { _id: conversationId },
      { $set: { [`unreadCounts.${userId}`]: 0 } }
    );
  };
  

