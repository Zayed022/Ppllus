import Post from "../models/post.models.js";
import Follow from "../models/follow.models.js";

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
    .limit(limit + 1);

  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  res.json({
    items: posts.map(p => ({
      type: "POST",
      ...p.toObject(),
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