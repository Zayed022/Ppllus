import mongoose from "mongoose";

const featureFlagSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    rolloutPercentage: {
      type: Number,
      default: 0, // 0–100
    },

    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("FeatureFlag", featureFlagSchema);
