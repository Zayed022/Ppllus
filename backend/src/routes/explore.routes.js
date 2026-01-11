import { Router } from "express";
import {
  getExploreReels,
  getReelsByCategory,
  getReelsByCity,
} from "../controllers/explore.controllers.js";

const router = Router();

router.get("/reels", getExploreReels);
router.get("/category/:category", getReelsByCategory);
router.get("/city/:city", getReelsByCity);

export default router;
