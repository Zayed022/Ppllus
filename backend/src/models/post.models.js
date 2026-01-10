import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["IMAGE", "VIDEO"], required: true },
        width: Number,
        height: Number,
      },
    ],

    caption: {
      type: String,
      maxlength: 2200,
    },

    tags: [{ type: String, index: true }],

    locationTag: {
      name: String,
      geo: {
        type: { type: String, enum: ["Point"] },
        coordinates: [Number],
      },
    },

    visibility: {
      type: String,
      enum: ["PUBLIC", "FOLLOWERS"],
      default: "PUBLIC",
      index: true,
    },

    // Cached counters
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ "locationTag.geo": "2dsphere" });

export default mongoose.model("Post", postSchema);
