import { Queue } from "bullmq";
import { getRedis } from "../db/redis.js";

export const pushQueue = new Queue("push", {
  connection: getRedis(),
});
