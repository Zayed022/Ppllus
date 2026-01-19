import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  createStory,
  viewStory,
  getStoryFeed,
  getStoryViewers,
  deleteStory,
  muteStoryUser,
  unmuteStoryUser,
  reactToStory,
  getStoryReactions,
  addStoryToHighlight,
  getUserHighlights,
  getMyActiveStories,
} from "../controllers/story.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

/**
 * ==========================
 * STORY CREATION & FEED
 * ==========================
 */

/**
 * Create a story
 * POST /api/v1/stories
 */
router.post(
  "/",
  authenticate,
  upload.fields([{ name: "mediaUrl", maxCount: 1 }]),             // done
  createStory
);        

/**
 * Get story feed (Instagram-style)
 * GET /api/v1/stories/feed
 */
router.get("/feed", authenticate, getStoryFeed);                 

/**
 * ==========================
 * STORY VIEWING
 * ==========================
 */

/**
 * View a story
 * POST /api/v1/stories/:storyId/view
 */
router.post("/:storyId/view", authenticate, viewStory);

router.get("/me", authenticate, getMyActiveStories);

/**
 * Get viewers of a story (owner only)
 * GET /api/v1/stories/:storyId/viewers
 */
router.get("/:storyId/viewers", authenticate, getStoryViewers);

/**
 * ==========================
 * STORY REACTIONS
 * ==========================
 */

/**
 * React to a story
 * POST /api/v1/stories/:storyId/react
 */
router.post("/:storyId/react", authenticate, reactToStory);

/**
 * Get reactions on a story (owner only)
 * GET /api/v1/stories/:storyId/reactions
 */
router.get("/:storyId/reactions", authenticate, getStoryReactions);

/**
 * ==========================
 * STORY MANAGEMENT
 * ==========================
 */

/**
 * Delete a story
 * DELETE /api/v1/stories/:storyId
 */
router.delete("/:storyId", authenticate, deleteStory);

/**
 * ==========================
 * STORY HIGHLIGHTS
 * ==========================
 */

/**
 * Add a story to a highlight
 * POST /api/v1/stories/highlights/:highlightId/:storyId
 */
router.post(
  "/highlights/:highlightId/:storyId",
  authenticate,
  addStoryToHighlight
);

/**
 * Get highlights of a user
 * GET /api/v1/stories/highlights/:userId
 */
router.get(
  "/highlights/:userId",
  authenticate,
  getUserHighlights
);

/**
 * ==========================
 * STORY MUTE / UNMUTE
 * ==========================
 */

/**
 * Mute a user's stories
 * POST /api/v1/stories/mute/:userId
 */
router.post("/mute/:userId", authenticate, muteStoryUser);

/**
 * Unmute a user's stories
 * POST /api/v1/stories/unmute/:userId
 */
router.post("/unmute/:userId", authenticate, unmuteStoryUser);

export default router;



/*

User A ID : 69653edba7f1a44bbb86fe40
user A Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTY1M2VkYmE3ZjFhNDRiYmI4NmZlNDAiLCJlbWFpbCI6InpheWVkYW5zMDIyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiemF5ZWRhbnMwMiIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzY4ODMwMjg1LCJleHAiOjE3NzAxMjYyODUsImF1ZCI6InBwbGx1cy1hcHAiLCJpc3MiOiJwcGxsdXMtYXV0aCJ9.kdYx7UMGnng6OwtBXkT6nLb4UWylTFKem33AhLzmJJE

User B ID: 6968b7ce8df01017fa2a76e8
User B Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTY4YjdjZThkZjAxMDE3ZmEyYTc2ZTgiLCJlbWFpbCI6InpheWVkYW5zMDg4QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiemF5ZWQuYW5zYXJpLjA4Iiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Njg4MzAxODUsImV4cCI6MTc3MDEyNjE4NSwiYXVkIjoicHBsbHVzLWFwcCIsImlzcyI6InBwbGx1cy1hdXRoIn0.1sqKWYYgaD9msdRi-6RsNmo7f0fuJEPPi2Jgbdh2OzE

User C ID: 696a4a62c0a6519c80d28fe5
User C Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTZhNGE2MmMwYTY1MTljODBkMjhmZTUiLCJlbWFpbCI6InpheWVkYW5zMDlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJ6YXllZCIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzY4ODMyMDEwLCJleHAiOjE3NzAxMjgwMTAsImF1ZCI6InBwbGx1cy1hcHAiLCJpc3MiOiJwcGxsdXMtYXV0aCJ9.FGICyjV-KPs0avOJ-0TmVteDicbc5Q2aLMbtmgWPMt4

*/