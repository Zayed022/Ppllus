import Reel from "../models/reel.models.js";
import Post from "../models/post.models.js"
import { getRedis } from "../db/redis.js";
import { processReelViewReward } from "../services/wallet.service.js";
const redis = getRedis();

export const getExploreReels = async (req, res) => {
  const cursor = Number(req.query.cursor || 0);
  const limit = Number(req.query.limit || 20);

  const FETCH_MULTIPLIER = 3;
  const fetchCount = limit * FETCH_MULTIPLIER;

  const hotCount = Math.floor(fetchCount * 0.7);
  const freshCount = fetchCount - hotCount;

  const [hotIds, freshIds] = await Promise.all([
    redis.zrevrange(
      "feed:explore:hot",
      cursor,
      cursor + hotCount - 1
    ),
    redis.zrevrange(
      "feed:explore:fresh",
      cursor,
      cursor + freshCount - 1
    ),
  ]);

  const reelIds = [...new Set([...hotIds, ...freshIds])];

  if (!reelIds.length) {
    return res.json({ data: [], nextCursor: cursor });
  }

  const reels = await Reel.find({
    _id: { $in: reelIds },
    isDeleted: false,
    "moderation.status": "ACTIVE",
  })
    .populate("creator", "username profileImage")
    .lean();

  const reelMap = new Map(
    reels.map(r => [r._id.toString(), r])
  );

  const ordered = reelIds
    .map(id => reelMap.get(id))
    .filter(Boolean);

  // 🧠 Instagram-style diversity
  const seenCreators = new Set();
  const seenCategories = new Set();
  const finalFeed = [];

  for (const reel of ordered) {
    if (finalFeed.length >= limit) break;

    const creatorId = reel.creator?._id?.toString();
    const category = reel.categories?.[0];

    if (creatorId && seenCreators.has(creatorId)) continue;

    if (category && seenCategories.has(category)) {
      if (Math.random() < 0.7) continue;
    }

    finalFeed.push(reel);

    if (creatorId) seenCreators.add(creatorId);
    if (category) seenCategories.add(category);
  }

  res.json({
    data: finalFeed,
    nextCursor: cursor + limit,
  });
};

export const getExplorePosts = async (req, res) => {
  const cursor = Number(req.query.cursor || 0);
  const limit = Number(req.query.limit || 21); // 3 columns

  const fetchCount = limit * 3;

  const [hotIds, freshIds] = await Promise.all([
    redis.zrevrange(
      "feed:explore:posts:hot",
      cursor,
      cursor + Math.floor(fetchCount * 0.7)
    ),
    redis.zrevrange(
      "feed:explore:posts:fresh",
      cursor,
      cursor + Math.floor(fetchCount * 0.3)
    ),
  ]);

  const postIds = [...new Set([...hotIds, ...freshIds])];

  const posts = await Post.find({
    _id: { $in: postIds },
    isDeleted: false,
    visibility: "PUBLIC",
  })
    .populate("author", "username profileImage")
    .lean();

  const postMap = new Map(
    posts.map(p => [p._id.toString(), p])
  );

  const ordered = postIds
    .map(id => postMap.get(id))
    .filter(Boolean);

  // 🎯 Diversity
  const seenAuthors = new Set();
  const final = [];

  for (const post of ordered) {
    if (final.length >= limit) break;

    const authorId = post.author?._id?.toString();
    if (authorId && seenAuthors.has(authorId)) continue;

    final.push(post);
    if (authorId) seenAuthors.add(authorId);
  }

  res.json({
    data: final,
    nextCursor: cursor + limit,
  });
};


export const getReelsByCategory = async (req, res) => {
  const { category } = req.params;

  const reels = await Reel.find({
    categories: category,
    isDeleted: false,
    "moderation.status": "ACTIVE",
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("creator", "_id username profileImage")
    .lean();

  res.json(reels);
};

export const getReelsByCity = async (req, res) => {
  const { city } = req.params;

  const reels = await Reel.find({
    city,
    isDeleted: false,
    "moderation.status": "ACTIVE",
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("creator", "_id username profileImage")
    .lean();

  res.json(reels);
};

export const getReelFeed = async (req, res) => {
  const cursor = Number(req.query.cursor || 0);
  const limit = Number(req.query.limit || 10);

  // Instagram v1 uses global ranked feed
  const key = "feed:reels:global";

  const reelIds = await redis.zrevrange(
    key,
    cursor,
    cursor + limit - 1
  );

  if (!reelIds.length) {
    return res.json({ data: [], nextCursor: cursor });
  }

  const reels = await Reel.find({
    _id: { $in: reelIds },
    isDeleted: false,
    "moderation.status": "ACTIVE",
  })
    .populate("creator", "username profileImage")
    .lean();

  const reelMap = new Map(
    reels.map(r => [r._id.toString(), r])
  );

  const ordered = reelIds
    .map(id => reelMap.get(id))
    .filter(Boolean);

  res.json({
    data: ordered,
    nextCursor: cursor + limit,
  });
};

export const trackReelView = async (req, res) => {
  const userId = req.user.sub;
  const reelId = req.params.reelId;
  const { watchTime } = req.body;

  try {
    await processReelViewReward({
      userId,
      reelId,
      watchTime,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Reel view reward error:", err);
    res.status(500).json({ message: "Failed to track reel view" });
  }
};




