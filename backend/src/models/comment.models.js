import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },

    reel: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },

    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ reel: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
