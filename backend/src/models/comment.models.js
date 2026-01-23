import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    // Target (exactly one)
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
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Ensure comment belongs to exactly one target
 */
commentSchema.pre("validate", async function () {
  if (!this.post && !this.reel) {
    throw new Error(
      "Comment must belong to either a post or a reel"
    );
  }

  if (this.post && this.reel) {
    throw new Error(
      "Comment cannot belong to both post and reel"
    );
  }
});



// Feed ordering
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ reel: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
