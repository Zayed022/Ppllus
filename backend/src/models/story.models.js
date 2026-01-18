import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mediaUrl: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO"],
      required: true,
    },

    duration: {
      type: Number, // seconds (video only)
    },

    city: {
      type: String,
      index: true,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["PUBLIC", "CLOSE_FRIENDS"],
      default: "PUBLIC",
      index: true,
    },
    

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 Auto-delete after 24 hours
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Feed ordering
storySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Story", storySchema);
