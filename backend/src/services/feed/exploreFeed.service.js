import { getRedis } from "../../db/redis.js";
import Reel from "../../models/reel.models.js";

const redis = getRedis();

export const getExploreFeed = async ({ limit = 20 }) => {
  // 1️⃣ Get ranked reel IDs
  const reelIds = await redis.zrevrange(
    "feed:explore",
    0,
    limit - 1
  );

  if (reelIds.length === 0) return [];

  // 2️⃣ Fetch reels
  const reels = await Reel.find({
    _id: { $in: reelIds },
    isDeleted: false,
  }).lean();

  // 3️⃣ Maintain Redis order
  const reelMap = new Map(reels.map((r) => [String(r._id), r]));

  return reelIds
    .map((id) => reelMap.get(id))
    .filter(Boolean);
};
