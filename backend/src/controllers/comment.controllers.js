import mongoose from "mongoose";
import Comment from "../models/comment.models.js";
import Post from "../models/post.models.js";
import Reel from "../models/reel.models.js";

export const createComment = async (req, res) => {
    const { postId, reelId } = req.params;
    const { text, parentComment } = req.body;
    const userId = req.user.sub;
  
    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }
  
    if (!postId && !reelId) {
      return res.status(400).json({ message: "Target not specified" });
    }
  
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const comment = await Comment.create(
        [
          {
            post: postId || undefined,
            reel: reelId || undefined,
            user: userId,
            text,
            parentComment: parentComment || null,
          },
        ],
        { session }
      );
  
      if (postId) {
        await Post.findByIdAndUpdate(
          postId,
          { $inc: { commentsCount: 1 } },
          { session }
        );
      }
  
      if (reelId) {
        await Reel.findByIdAndUpdate(
          reelId,
          { $inc: { commentsCount: 1 } },
          { session }
        );
      }
  
      await session.commitTransaction();
      res.status(201).json(comment[0]);
    } catch (err) {
      await session.abortTransaction();
      console.error("Create comment error:", err);
      res.status(500).json({ message: "Failed to create comment" });
    } finally {
      session.endSession();
    }
};

export const getComments = async (req, res) => {
  const { postId, reelId } = req.params;
  const { cursor, limit = 20 } = req.query;

  const query = {
    isDeleted: false,
    parentComment: null,
  };

  if (postId) query.post = postId;
  if (reelId) query.reel = reelId;

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const comments = await Comment.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit))
    .populate({
      path: "user",
      select: "username profileImage",
      options: { lean: true },
    })
    .lean();

  res.json(
    comments.map((c) => ({
      ...c,
      user: {
        ...c.user,
        profileImage: c.user?.profileImage || null,
      },
    }))
  );
};


export const getCommentReplies = async (req, res) => {
    const { commentId } = req.params;
    const { cursor, limit = 20 } = req.query;
  
    const query = {
      parentComment: commentId,
      isDeleted: false,
    };
  
    if (cursor) {
      query._id = { $lt: cursor };
    }
  
    const replies = await Comment.find(query)
      .sort({ _id: 1 })
      .limit(Number(limit))
      .populate("user", "username profileImage")
      .lean();
  
    res.json(replies);
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.sub;
  
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
  
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }
  
    if (comment.isDeleted) {
      return res.json({ status: "ALREADY_DELETED" });
    }
  
    comment.isDeleted = true;
    await comment.save();
  
    if (comment.post) {
      await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 },
      });
    }
  
    if (comment.reel) {
      await Reel.findByIdAndUpdate(comment.reel, {
        $inc: { commentsCount: -1 },
      });
    }
  
    res.json({ status: "COMMENT_DELETED" });
};

export const toggleLikeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.sub;
  
    const CommentLike = mongoose.model("CommentLike");
  
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const existing = await CommentLike.findOne(
        { comment: commentId, user: userId },
        null,
        { session }
      );
  
      if (existing) {
        await existing.deleteOne({ session });
        await Comment.findByIdAndUpdate(
          commentId,
          { $inc: { likesCount: -1 } },
          { session }
        );
  
        await session.commitTransaction();
        return res.json({ liked: false });
      }
  
      await CommentLike.create(
        [{ comment: commentId, user: userId }],
        { session }
      );
  
      await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { likesCount: 1 } },
        { session }
      );
  
      await session.commitTransaction();
      res.json({ liked: true });
    } catch (err) {
      await session.abortTransaction();
      console.error("Toggle comment like error:", err);
      res.status(500).json({ message: "Failed to toggle like" });
    } finally {
      session.endSession();
    }
};

export const getCommentLikes = async (req, res) => {
    const { commentId } = req.params;
  
    const CommentLike = mongoose.model("CommentLike");
  
    const likes = await CommentLike.find({ comment: commentId })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 })
      .lean();
  
    res.json(likes.map(l => l.user));
};
  
  
  
  
  