import { getRedis } from "../db/redis.js";
const redis = getRedis();


export const rateLimiter = ({
  keyPrefix,
  limit,
  windowSec,
}) => async (req, res, next) => {
  const key = `${keyPrefix}:${req.ip}`;

  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSec);
  }

  if (count > limit) {
    return res.status(429).json({
      message: "Too many requests. Slow down.",
    });
  }

  next();
};
