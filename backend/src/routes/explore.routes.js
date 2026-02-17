import { Router } from "express";
import {
  getExplorePosts,
  getExploreReels,
  getReelFeed,
  getReelsByCategory,
  getReelsByCity,
  trackReelView,
} from "../controllers/explore.controllers.js";

import {authenticate} from "../middlewares/auth.middlewares.js"

const router = Router();

router.get(
  "/feed",
  authenticate,
  getReelFeed
);

router.get(
  "/explore",
  authenticate, // optional but recommended
  getExploreReels
);

router.post(
  "/:reelId/view",
  authenticate,
  trackReelView
);


router.get(
  "/explore/posts",
  authenticate,
  getExplorePosts
);
router.get("/category/:category", getReelsByCategory);
router.get("/city/:city", getReelsByCity);

export default router;
