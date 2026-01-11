import { getRedis } from "../db/redis.js";
const redis = getRedis();

export const addReelToExploreFeed = async (reelId, score) => {
  await redis.zincrby("feed:explore", score, reelId);
};

export const getExploreFeed = async (start = 0, stop = 19) => {
  return redis.zrevrange("feed:explore", start, stop);
};

export const getCategoryFeed = async (category, start = 0, stop = 19) => {
  return redis.zrevrange(`feed:category:${category}`, start, stop);
};
