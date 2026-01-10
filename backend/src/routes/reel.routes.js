import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  createReel,
  getReelFeed,
} from "../controllers/reel.controllers.js";

import {
  recordReelView,
  likeReel,
  shareReel,
} from "../controllers/engagement.controllers.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();
const engagementLimiter = rateLimiter({
  keyPrefix: "engagement",
  limit: 100,
  windowSec: 60,
});

router.post("/", authenticate, createReel);
router.get("/feed", authenticate, getReelFeed);

router.post("/:reelId/view", authenticate,engagementLimiter, recordReelView);
router.post("/:reelId/like", authenticate, engagementLimiter, likeReel);
router.post("/:reelId/share", authenticate, engagementLimiter, shareReel);

export default router;
