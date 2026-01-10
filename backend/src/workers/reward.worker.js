import { Worker } from "bullmq";
import { redis } from "../db/redis.js";
import { processReelViewReward } from "../services/reward.service.js";

new Worker(
  "events",
  async (job) => {
    if (job.name === "REEL_VIEW") {
      await processReelViewReward(job.data);
    }
  },
  { connection: redis }
);
