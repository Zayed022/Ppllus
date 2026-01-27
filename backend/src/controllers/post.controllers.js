import Post from "../models/post.models.js";
import Follow from "../models/follow.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import PostLike from "../models/postLike.models.js"



export const createPost = async (req, res) => {
  try {
    const { caption, tags, visibility, locationTag } = req.body;

    if (!req.files?.media?.length) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const uploadedMedia = [];

    for (const file of req.files.media) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (!uploaded?.url) {
        return res.status(500).json({
          message: "Media upload failed",
        });
      }

      uploadedMedia.push({
        url: uploaded.url,
        type: uploaded.resource_type === "video" ? "VIDEO" : "IMAGE",
        width: uploaded.width,
        height: uploaded.height,
      });
    }

    const post = await Post.create({
      author: req.user.sub, // ✅ REQUIRED
      media: uploadedMedia, // ✅ ARRAY OF OBJECTS
      caption,
      tags,
      visibility,
      locationTag,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getPostFeed = async (req, res) => {
  const userId = req.user.sub;
  const limit = Number(req.query.limit || 10);
  const cursor = req.query.cursor;

  const following = await Follow.find({
    follower: userId,
    status: "ACTIVE",
  }).select("following");

  const authorIds = following.map(f => f.following).concat(userId);

  const query = {
    author: { $in: authorIds },
    isDeleted: false,
  };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  const posts = await Post.find(query)
    .populate("author", "username profileImage")
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  /** 🔴 IMPORTANT PART: Fetch likes by THIS USER */
  const PostLike = mongoose.model("PostLike");

  const likedDocs = await PostLike.find({
    user: userId,
    post: { $in: posts.map(p => p._id) },
  }).select("post");

  const likedSet = new Set(
    likedDocs.map(l => l.post.toString())
  );

  res.json({
    items: posts.map(p => ({
      type: "POST",
      post: {
        ...p,
        isLiked: likedSet.has(p._id.toString()),
        isOwnPost: p.author._id.toString() === userId,
      },
    })),
    nextCursor: hasMore
      ? posts[posts.length - 1].createdAt
      : null,
  });
};

export const getFollowingPosts = async ({
    userId,
    cursor,
    limit = 10,
  }) => {
    const following = await Follow.find({
      follower: userId,
      status: "ACTIVE",
    }).select("following");
  
    const authorIds = following.map(f => f.following).concat(userId);
  
    const query = {
      author: { $in: authorIds },
      isDeleted: false,
    };
  
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }
  
    const posts = await Post.find(query)
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 })
      .limit(limit + 1);
  
    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();
  
    return {
      items: posts.map(post => ({
        type: "POST",
        post,
      })),
      nextCursor: hasMore
        ? posts[posts.length - 1].createdAt
        : null,
    };
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user.sub,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user.sub;

    const isFollowing = await Follow.exists({
      follower: viewerId,
      following: userId,
      status: "ACTIVE",
    });

    const query = {
      author: userId,
      isDeleted: false,
      $or: [
        { visibility: "PUBLIC" },
        ...(isFollowing ? [{ visibility: "FOLLOWERS" }] : []),
      ],
    };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "username profileImage")
      .lean();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      isDeleted: false,
    }).populate("author", "username profileImage");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.sub;

  const Like = mongoose.model("PostLike");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await Like.findOne(
      { post: postId, user: userId },
      null,
      { session }
    );

    if (existing) {
      await existing.deleteOne({ session });
      await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { session }
      );

      await session.commitTransaction();
      return res.json({ liked: false });
    }

    await Like.create(
      [{ post: postId, user: userId }],
      { session }
    );

    await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: 1 } },
      { session }
    );

    await session.commitTransaction();
    res.json({ liked: true });
  } catch (err) {
    await session.abortTransaction();
    console.error("Toggle like error:", err);
    res.status(500).json({ message: "Failed to toggle like" });
  } finally {
    session.endSession();
  }
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== req.user.sub) {
    return res.status(403).json({ message: "Not allowed" });
  }

  post.isDeleted = true;
  await post.save();

  res.json({ status: "POST_DELETED" });
};

export const getPostsByLocation = async (req, res) => {
  const { lng, lat, radius = 5000 } = req.query;

  const posts = await Post.find({
    isDeleted: false,
    "locationTag.geo": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
        $maxDistance: Number(radius),
      },
    },
  })
    .limit(50)
    .populate("author", "username profileImage");

  res.json(posts);
};

export const getPostsByTag = async (req, res) => {
  const { tag } = req.params;

  const posts = await Post.find({
    tags: tag,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("author", "username profileImage");

  res.json(posts);
};

