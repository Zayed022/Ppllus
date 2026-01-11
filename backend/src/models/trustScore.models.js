import mongoose from "mongoose";

const trustScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
      required: true,
    },

    score: {
      type: Number,
      default: 100, // start neutral
      index: true,
    },

    flags: {
      spam: { type: Number, default: 0 },
      velocity: { type: Number, default: 0 },
      abuse: { type: Number, default: 0 },
    },

    shadowBanned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TrustScore", trustScoreSchema);
