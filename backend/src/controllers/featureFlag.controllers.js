import FeatureFlag from "../models/featureFlag.models.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();

export const updateFeatureFlag = async (req, res) => {
  const { key, enabled, rolloutPercentage } = req.body;

  const flag = await FeatureFlag.findOneAndUpdate(
    { key },
    { enabled, rolloutPercentage },
    { upsert: true, new: true }
  );
  await redis.del(`feature:${key}`);


  res.json(flag);
};
