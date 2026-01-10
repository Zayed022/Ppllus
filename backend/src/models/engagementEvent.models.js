import mongoose, { Schema } from "mongoose";

const engagementEventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    contentType: {
      type: String,
      enum: ["POST", "REEL"],
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      enum: ["VIEW", "LIKE", "SHARE", "COMMENT"],
      required: true,
      index: true,
    },

    watchTime: {
      type: Number, // seconds (for reels ranking)
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate likes
engagementEventSchema.index(
  { user: 1, contentId: 1, eventType: 1 },
  { unique: true, partialFilterExpression: { eventType: "LIKE" } }
);

engagementEventSchema.index({ contentId: 1, createdAt: -1 });
engagementEventSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("EngagementEvent", engagementEventSchema);
