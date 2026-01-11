import Reel from "../models/reel.models.js";
import Follow from "../models/follow.models.js";

export const createReel = async (req, res) => {
  const { videoUrl, thumbnailUrl, duration, categories, city } = req.body;

  const reel = await Reel.create({
    creator: req.user.sub,
    videoUrl,
    thumbnailUrl,
    duration,
    categories,
    city,
  });

  res.status(201).json(reel);
};

import { getRedis } from "../db/redis.js";
const redis = getRedis();


export const getReelFeed = async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const cacheKey = `reels:feed:${req.user.sub}:${cursor || "first"}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // existing MongoDB feed logic here
  const reels = await buildFeed(req);

  await redis.set(
    cacheKey,
    JSON.stringify(reels),
    "EX",
    30
  );

  res.json(reels);
};

export const getReelStats = async (reelId) => {
    const key = `reel:stats:${reelId}`;
  
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  
    const reel = await Reel.findById(reelId).select(
      "viewsCount likesCount sharesCount"
    );
  
    await redis.set(
      key,
      JSON.stringify(reel),
      "EX",
      60
    );
  
    return reel;
};





  



