import { Worker } from "bullmq";
import { redis } from "../db/redis.js";
import Reel from "../models/reel.models.js";
import { rankReel } from "../services/feedRanking.service.js";

export const eventWorker = new Worker(
  "events",
  async (job) => {
    const event = job.data;

    switch (event.type) {
      case "REEL_VIEW": {
        await rankReel({
          reelId: event.entityId,
          creatorId: event.targetUserId,
          watchTime: event.watchTime,
        });
        break;
      }

      case "LIKE": {
        const reel = await Reel.findById(event.entityId).select("creator");
        if (!reel) return;

        await rankReel({
          reelId: event.entityId,
          creatorId: reel.creator,
          liked: true,
        });
        break;
      }

      case "SHARE": {
        const reel = await Reel.findById(event.entityId).select("creator");
        if (!reel) return;

        await rankReel({
          reelId: event.entityId,
          creatorId: reel.creator,
          shared: true,
        });
        break;
      }
    }
  },
  { connection: redis }
);
