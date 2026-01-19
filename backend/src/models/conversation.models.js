import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      index: true,
      validate: (v) => v.length === 2,
    },

    lastMessage: {
      text: String,
      sender: mongoose.Schema.Types.ObjectId,
      createdAt: Date,
    },

    unreadCounts: {
      type: Map,
      of: Number, // userId -> unread count
      default: {},
    },
  },
  { timestamps: true }
);

// Prevent duplicate conversations
conversationSchema.index(
  { participants: 1 },
  { unique: true }
);

export default mongoose.model("Conversation", conversationSchema);
