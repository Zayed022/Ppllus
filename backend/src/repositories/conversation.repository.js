import Conversation from "../models/conversation.models.js";

/**
 * Find or create a 1-to-1 conversation
 * Participants must be sorted to enforce uniqueness
 */
export const findOrCreateConversation = async (
  userA,
  userB,
  session
) => {
  const participants = [userA, userB].sort();

  return Conversation.findOneAndUpdate(
    { participants },
    { $setOnInsert: { participants } },
    { upsert: true, new: true, session }
  );
};


/**
 * Get inbox for a user
 * Optimized for fast reads
 */
export const getInboxByUser = async (userId) => {
  return Conversation.find({ participants: userId })
    .sort({ updatedAt: -1 })
    .select("participants lastMessage unreadCounts updatedAt")
    .populate("participants", "username profileImage")
    .lean();
};


/**
 * Reset unread count for a user in a conversation
 */
export const resetUnreadCount = async (conversationId, userId) => {
  return Conversation.updateOne(
    { _id: conversationId },
    { $set: { [`unreadCounts.${userId}`]: 0 } }
  );
};
