import express from "express";
import {
  followUser,
  unfollowUser,
  acceptFollowRequest,
  rejectFollowRequest,
  getFollowers,
  getFollowing,
  getFollowRequests,
} from "../controllers/follow.controllers.js";

import { authenticate } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/:userId", authenticate, followUser);
router.delete("/:userId", authenticate, unfollowUser);

router.get("/followers/:userId", authenticate, getFollowers);
router.get("/following/:userId", authenticate, getFollowing);

router.get("/requests", authenticate, getFollowRequests);
router.post("/requests/:followerId/accept", authenticate, acceptFollowRequest);
router.delete("/requests/:followerId/reject", authenticate, rejectFollowRequest);

export default router;
