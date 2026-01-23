// workers/exploreFeed.worker.js
import Reel from "../models/reel.models.js";
import { getRedis } from "../db/redis.js";
import { scoreReel } from "./feedScore.worker.js";

const redis = getRedis();

export const buildExploreFeed = async () => {
  const reels = await Reel.find({ isDeleted: false })
    .select("_id creator categories createdAt viewsCount likesCount sharesCount")
    .lean();

  const pipeline = redis.pipeline();

  for (const reel of reels) {
    const score = scoreReel({
      reel,
      userSignals: {
        following: new Set(),
        categories: new Set(),
      },
    });

    pipeline.zadd(
      "feed:explore",
      score,
      reel._id.toString()
    );
  }

  await pipeline.exec();
};
