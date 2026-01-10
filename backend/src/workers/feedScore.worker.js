import EngagementEvent from "../models/engagementEvent.models.js";
import Reel from "../models/reel.models.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();


export const updateReelScore = async (reelId) => {
  const reel = await Reel.findById(reelId);
  if (!reel || reel.isDeleted) return;

  const stats = await EngagementEvent.aggregate([
    { $match: { contentId: reel._id } },
    {
      $group: {
        _id: null,
        views: { $sum: { $cond: [{ $eq: ["$eventType", "VIEW"] }, 1, 0] } },
        likes: { $sum: { $cond: [{ $eq: ["$eventType", "LIKE"] }, 1, 0] } },
        shares: { $sum: { $cond: [{ $eq: ["$eventType", "SHARE"] }, 1, 0] } },
        comments: { $sum: { $cond: [{ $eq: ["$eventType", "COMMENT"] }, 1, 0] } },
        watchTime: { $sum: "$watchTime" },
      },
    },
  ]);

  const s = stats[0] || {};
  const score =
    (s.watchTime || 0) * 0.01 +
    (s.likes || 0) * 3 +
    (s.shares || 0) * 6 +
    (s.comments || 0) * 4;

  await redis.zadd("reels:global", score, reelId);

  for (const category of reel.categories || []) {
    await redis.zadd(`reels:category:${category}`, score, reelId);
  }
};

export const scoreReel = ({
  reel,
  userSignals,
  now = Date.now(),
}) => {
  let score = 0;

  if (userSignals.following.has(reel.creator.toString())) {
    score += 40;
  }

  if (userSignals.categories.hasAny(reel.categories)) {
    score += 25;
  }

  const ageHours = (now - reel.createdAt.getTime()) / 36e5;
  score += Math.max(0, 10 - ageHours); // freshness decay

  score += Math.log1p(reel.viewsCount) * 5;
  score += reel.likesCount * 2;
  score += reel.sharesCount * 3;

  return score;
};

