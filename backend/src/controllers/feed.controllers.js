import { getRedis } from "../db/redis.js";
import { getFeedCandidates } from "../service/feedWorker.service.js";
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
