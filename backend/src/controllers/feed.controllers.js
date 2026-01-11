import { getRedis } from "../db/redis.js";
import Story from "../models/story.models.js";
import Follow from "../models/follow.models.js";
import { getFeedCandidates } from "../services/feedWorker.service.js";
import { getHomeFeed } from "../services/feed/homeFeed.service.js";
import { getExploreFeed } from "../services/feed/exploreFeed.service.js";
import { getCategoryFeed } from "../services/feed/categoryFeed.service.js";
import { scoreReel } from "../workers/feedScore.worker.js";
const redis = getRedis();

export const getReelFeed = async (req, res) => {
  const userId = req.user.sub;
  const cacheKey = `feed:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const candidates = await getFeedCandidates(userId);

  const userSignals = await redis.get(`user:signals:${userId}`);
  const parsedSignals = JSON.parse(userSignals || "{}");

  const ranked = candidates
    .map(reel => ({
      reel,
      score: scoreReel({ reel, userSignals: parsedSignals }),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(r => r.reel);

  await redis.set(cacheKey, JSON.stringify(ranked), "EX", 30);

  res.json(ranked);
};

export const getStoryFeed = async (req, res) => {
  const userId = req.user.sub;
  const cacheKey = `stories:feed:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const following = await Follow.find({
    follower: userId,
    status: "ACTIVE",
  }).select("following");

  const userIds = following.map(f => f.following).concat(userId);

  const stories = await Story.aggregate([
    {
      $match: {
        user: { $in: userIds },
        expiresAt: { $gt: new Date() },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$user",
        story: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$story" } },
  ]);

  await redis.set(cacheKey, JSON.stringify(stories), "EX", 30);
  res.json(stories);
};

export const getHomeFeed = async (req, res) => {
  const reels = await redis.zrevrange(
    "feed:explore",
    0,
    19
  );

  res.json(reels);
};

export const getExploreReels = async (req, res) => {
  const reels = await redis.zrevrange(
    "feed:explore",
    0,
    49
  );

  res.json(reels);
};

export const getReelsByCategory = async (req, res) => {
  const { category } = req.params;

  const reels = await redis.zrevrange(
    `feed:category:${category}`,
    0,
    19
  );

  res.json(reels);
};

export const homeFeed = async (req, res) => {
  const data = await getHomeFeed({
    userId: req.user.sub,
    cursor: req.query.cursor,
    limit: Number(req.query.limit || 20),
  });

  res.json(data);
};

export const exploreFeed = async (req, res) => {
  const reels = await getExploreFeed({
    limit: Number(req.query.limit || 20),
  });

  res.json(reels);
};

export const categoryFeed = async (req, res) => {
  const data = await getCategoryFeed({
    category: req.params.category,
    cursor: req.query.cursor,
    limit: Number(req.query.limit || 20),
  });

  res.json(data);
};


