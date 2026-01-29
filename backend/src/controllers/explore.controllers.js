import Reel from "../models/reel.models.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();

export const getExploreReels = async (req, res) => {
  const cached = await redis.get("explore:reels");

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // 🔥 FALLBACK TO DB
  const reels = await Reel.find({
    isDeleted: false,
    "moderation.status": "ACTIVE",
  })
    .sort({ createdAt: -1 })
    .limit(60)
    .select("thumbnail video creator")
    .lean();

  // 🔥 CACHE IT
  await redis.set(
    "explore:reels",
    JSON.stringify(reels),
    "EX",
    60 * 10 // 10 minutes
  );

  res.json(reels);
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



