import mongoose from "mongoose";

const storyReactionSchema = new mongoose.Schema(
    {
      story: { type: mongoose.Schema.Types.ObjectId, ref: "Story", index: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
      emoji: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  storyReactionSchema.index({ story: 1, user: 1 }, { unique: true });
  
  export default mongoose.model("StoryReaction", storyReactionSchema);
  