import mongoose, { Schema } from "mongoose";

const reelSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    videoUrl: { type: String, required: true },

    thumbnailUrl: String,

    duration: { type: Number, required: true }, // seconds

    categories: [{ type: String, index: true }],

    city: { type: String, index: true },

    // Cached metrics
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },
    moderation: {
      status: {
        type: String,
        enum: ["ACTIVE", "UNDER_REVIEW", "REMOVED", "SHADOW_BANNED"],
        default: "ACTIVE",
        index: true,
      },
      reason: String,
      reviewedAt: Date,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    }
    
  },
  { timestamps: true }
);

reelSchema.index({ createdAt: -1 });
reelSchema.index({ viewsCount: -1 });
reelSchema.index({ categories: 1, createdAt: -1 });

export default mongoose.model("Reel", reelSchema);
