import { Router } from "express";
import { getPostFeed } from "../controllers/post.controllers.js";
import { homeFeed } from "../controllers/home.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {  categoryFeed, exploreFeed, getExploreReels, getHomeFeed2, getReelFeed, getReelsByCategory, getStoryFeed } from "../controllers/feed.controllers.js";


const router = Router();

router.get("/feed", authenticate, getPostFeed);
router.get("/home", authenticate, homeFeed);
router.get(
    "/stories",
    authenticate,
    getStoryFeed
  );
 
  router.get(
    "/reels",
    authenticate,
    getReelFeed
  );
 
  router.get(
    "/home",
    authenticate,
    getHomeFeed2
  );
  
  
  router.get(
    "/explore",
    authenticate,
    exploreFeed
  );
  
 
  router.get(
    "/explore/raw",
    authenticate,
    getExploreReels
  );
  
  
  router.get(
    "/category/:category",
    authenticate,
    categoryFeed
  );
  
  
  router.get(
    "/category/:category/raw",
    authenticate,
    getReelsByCategory
  );
  




export default router;
