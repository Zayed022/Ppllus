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
import mongoose from "mongoose";
import { sendPushNotification } from "../utils/push.utils.js";
  
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
  export const sendMessageService = async ({ from, to, body, media }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const conversation = await findOrCreateConversation(from, to, session);
  
      const message = await createMessage(
        {
          conversationId: conversation._id,
          senderId: from,
          body: body || "",
          media: media || undefined,
          status: "SENT",
        },
        session
      );
  
      await Conversation.updateOne(
        { _id: conversation._id },
        {
          $set: {
            lastMessage: {
              text: body || (media?.type === "IMAGE" ? "📷 Photo" : "🎥 Video"),
              sender: from,
              createdAt: message.createdAt,
            },
          },
          $inc: { [`unreadCounts.${to}`]: 1 },
        },
        { session }
      );
  
      await session.commitTransaction();

      const recipient = await User.findById(to).select("pushTokens username");

if (recipient?.pushTokens?.length) {
  await sendPushNotification({
    tokens: recipient.pushTokens,
    title: "New Message",
    body: body || "📎 Sent a media",
    data: {
      conversationId: conversation._id.toString(),
      senderId: from,
    },
  });
}

return { conversationId: conversation._id, message };
  
      return {
        conversationId: conversation._id,
        message,
      };
  
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  };
  
  
  /**
   * Mark conversation as seen
   */
  export const markConversationSeenService = async (
    conversationId,
    userId
  ) => {
    await Promise.all([
      Message.updateMany(
        {
          conversationId,
          senderId: { $ne: userId },
          status: { $ne: "SEEN" },
        },
        { $set: { status: "SEEN" } }
      ),
      Conversation.updateOne(
        { _id: conversationId },
        { $set: { [`unreadCounts.${userId}`]: 0 } }
      ),
    ]);
  };
  
  
  

