import mongoose, { Schema } from "mongoose";

const storySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mediaUrl: { type: String, required: true },

    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// TTL index 
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Story", storySchema);
