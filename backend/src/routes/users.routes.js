import express from "express";
import {
  getMe,
  updateBasicProfile,
  updateDobGender,
  updateInterests,
  updateProfileImage,
  completeOnboarding,
  searchUsers,
  updatePrivacy,
  deactivateAccount,
  register,
  login,
  refreshAccessToken,
} from "../controllers/users.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

const authLimiter = rateLimiter({
  keyPrefix: "auth",
  limit: 10,
  windowSec: 60,
});

// Authenticated routes
router.get("/me", authenticate, getMe);
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refreshAccessToken);

router.patch("/profile/basic", authenticate, updateBasicProfile);
router.patch("/profile/dob-gender", authenticate, updateDobGender);
router.patch("/profile/interests", authenticate, updateInterests);
router.patch("/profile/image", authenticate, updateProfileImage);
router.post("/onboarding/complete", authenticate, completeOnboarding);

router.get("/search", authenticate, searchUsers);
router.patch("/privacy", authenticate, updatePrivacy);
router.delete("/deactivate", authenticate, deactivateAccount);

export default router;
