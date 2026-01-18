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
  upload.fields([{ name: "mediaUrl", maxCount: 1 }]),
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
