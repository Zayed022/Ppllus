import mongoose from "mongoose";

const storyHighlightSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
      title: { type: String, required: true },
      coverImage: String,
      stories: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
      ],
    },
    { timestamps: true }
  );
  
  export default mongoose.model("StoryHighlight", storyHighlightSchema);
  