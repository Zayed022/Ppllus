import FeatureFlag from "../models/featureFlag.models.js";
import { getRedis } from "../db/redis.js";

const redis = getRedis();

export const isFeatureEnabled = async (key, userId = null) => {
  const cacheKey = `feature:${key}`;

  let flag = await redis.get(cacheKey);

  if (!flag) {
    const dbFlag = await FeatureFlag.findOne({ key });
    if (!dbFlag) return false;

    flag = JSON.stringify(dbFlag);
    await redis.set(cacheKey, flag, "EX", 60);
  }

  const { enabled, rolloutPercentage } = JSON.parse(flag);

  if (!enabled) return false;
  if (rolloutPercentage === 100) return true;

  if (!userId) return false;

  const hash = parseInt(userId.slice(-2), 16) % 100;
  return hash < rolloutPercentage;
};
