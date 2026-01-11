import mongoose from "mongoose";

const creatorAnalyticsSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },

    date: {
      type: Date,
      index: true,
      required: true,
    },

    reels: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      watchTime: { type: Number, default: 0 },
    },

    followers: {
      gained: { type: Number, default: 0 },
      lost: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

creatorAnalyticsSchema.index(
  { creator: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("CreatorAnalytics", creatorAnalyticsSchema);
