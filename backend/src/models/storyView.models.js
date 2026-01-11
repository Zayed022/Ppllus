import mongoose from "mongoose";

const storyViewSchema = new mongoose.Schema(
  {
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },

    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Prevent duplicate views
storyViewSchema.index(
  { story: 1, viewer: 1 },
  { unique: true }
);

export default mongoose.model("StoryView", storyViewSchema);
