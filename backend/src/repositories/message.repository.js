import Message from "../models/message.models.js";

/**
 * Create message
 */
export const createMessage = async (payload) => {
  return Message.create(payload);
};

/**
 * Cursor-based pagination
 * Fast and memory-safe
 */
export const getMessagesByConversation = async (
  conversationId,
  cursor,
  limit = 20
) => {
  return Message.find({
    conversationId,
    ...(cursor && { createdAt: { $lt: cursor } }),
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Mark messages as seen
 */
export const markMessagesAsSeen = async (conversationId, userId) => {
  return Message.updateMany(
    {
      conversationId,
      senderId: { $ne: userId },
      status: { $ne: "SEEN" },
    },
    { $set: { status: "SEEN" } }
  );
};
