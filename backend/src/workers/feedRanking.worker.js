import { getRedis } from "../db/redis.js";
import trustScoreModels from "../models/trustScore.models.js";

const redis = getRedis();

export const rankReel = async ({
  reelId,
  creatorId,
  watchTime = 0,
  liked = false,
  shared = false,
}) => {
  const freshnessBoost = Math.max(
    0,
    48 - Math.floor((Date.now() - Date.now()) / 3600000)
  );

  let score =
    watchTime * 1.5 +
    (liked ? 3 : 0) +
    (shared ? 5 : 0) +
    freshnessBoost;

  score = await applyTrustPenalty(creatorId, score);

  await redis.zincrby("feed:explore", score, reelId.toString());
};

export const applyTrustPenalty = async (userId, baseScore) => {
  const trust = await trustScoreModels.findOne({ user: userId });

  if (!trust) return baseScore;
  if (trust.shadowBanned) return baseScore * 0.1;
  if (trust.score < 60) return baseScore * 0.5;

  return baseScore;
};
