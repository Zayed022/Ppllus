import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  createReel,
  deleteReel,
  getMyReels,
  getReelById,
  getReelFeed,
  getUserReels,
  incrementReelView,
  getReelComments
} from "../controllers/reel.controllers.js";

import {
  recordReelView,
  likeReel,
  shareReel,
  toggleLikeReel,
  createReelComment, 
  incrementReelView2,
} from "../controllers/engagement.controllers.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();
const engagementLimiter = rateLimiter({
  keyPrefix: "engagement",
  limit: 100,
  windowSec: 60,
});

router.post("/", authenticate, upload.fields([
  { name: "videoUrl", maxCount: 1 },
  { name: "thumbnailUrl", maxCount: 1 },
]), createReel);

router.get("/feed", authenticate, getReelFeed);
router.get("/me", authenticate, getMyReels);
router.get("/user/:userId", getUserReels);
router.get("/:reelId", getReelById);

router.post("/:reelId/view", engagementLimiter, recordReelView);
router.post("/:reelId/like", authenticate, engagementLimiter, toggleLikeReel);
router.post("/:reelId/share", authenticate, engagementLimiter, shareReel);

router.post("/:reelId/comments", authenticate, createReelComment);
router.get("/:reelId/comments", authenticate, getReelComments);

router.delete("/:reelId", authenticate, deleteReel);



export default router;


/*
User B Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTY4YjdjZThkZjAxMDE3ZmEyYTc2ZTgiLCJlbWFpbCI6InpheWVkYW5zMDg4QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiemF5ZWQwOCIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzY4OTk2ODE5LCJleHAiOjE3NzAyOTI4MTksImF1ZCI6InBwbGx1cy1hcHAiLCJpc3MiOiJwcGxsdXMtYXV0aCJ9.50OtmA07JGRYtFMweG6a8XL3oYR2U36aHEw-3TNBIww


User C Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTZhNGE2MmMwYTY1MTljODBkMjhmZTUiLCJlbWFpbCI6InpheWVkYW5zMDlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJ6YXllZCIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzY5MDc1NDU0LCJleHAiOjE3NzAzNzE0NTQsImF1ZCI6InBwbGx1cy1hcHAiLCJpc3MiOiJwcGxsdXMtYXV0aCJ9.snTPyqp9la9t6rQCzYuAt_ZCalHL-N5hgU3jsL3Rj3M
*/