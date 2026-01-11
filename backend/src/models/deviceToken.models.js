
import mongoose from "mongoose";

const deviceTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    platform: {
      type: String,
      enum: ["ANDROID", "IOS", "WEB"],
      required: true,
      index: true,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

deviceTokenSchema.index({ user: 1, platform: 1 });

export default mongoose.model("DeviceToken", deviceTokenSchema);
