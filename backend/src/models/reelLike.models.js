import mongoose from "mongoose";

const reelLikeSchema = new mongoose.Schema(
  {
    reel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate likes
reelLikeSchema.index({ reel: 1, user: 1 }, { unique: true });

export default mongoose.model("ReelLike", reelLikeSchema);
