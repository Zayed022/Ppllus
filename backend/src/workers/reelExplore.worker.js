import Reel from "../models/reel.models.js";
import { getRedis } from "../db/redis.js";

const redis = getRedis();

export const computeExploreFeed = async () => {
  const reels = await Reel.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $addFields: {
        score: {
          $add: [
            "$viewsCount",
            { $multiply: ["$likesCount", 3] },
            { $multiply: ["$sharesCount", 5] },
          ],
        },
      },
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 200 },
  ]);

  await redis.set(
    "explore:reels",
    JSON.stringify(reels),
    "EX",
    60
  );
};
