import Reel from "../models/reel.models.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();

export const getExploreReels = async (req, res) => {
  const data = await redis.get("explore:reels");
  res.json(data ? JSON.parse(data) : []);
};

export const getReelsByCategory = async (req, res) => {
  const { category } = req.params;

  const reels = await Reel.find({
    categories: category,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json(reels);
};

export const getReelsByCity = async (req, res) => {
  const { city } = req.params;

  const reels = await Reel.find({
    city,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json(reels);
};
