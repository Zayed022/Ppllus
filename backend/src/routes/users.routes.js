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
  getMyProfileImage,
  getUserProfile,
  getUserProfileById,
} from "../controllers/users.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { searchUsers2 } from "../controllers/search.controllers.js";

const router = express.Router();

const authLimiter = rateLimiter({
  keyPrefix: "auth",
  limit: 10,
  windowSec: 60,
});

// Authenticated routes
router.get("/me", authenticate, getMe);
router.post("/register", authLimiter, register); // done
router.post("/login", authLimiter, login);       // done
router.post("/refresh", authLimiter, refreshAccessToken);
router.patch("/profile/basic", authenticate, updateBasicProfile);    // done
router.patch("/profile/dob-gender", authenticate, updateDobGender); // done
router.patch("/profile/interests", authenticate, updateInterests);  // done
router.route("/profile/image").patch(authenticate, 
  upload.fields([
      {
          name:"profileImage",
          maxCount:1
      }
  ]),
  updateProfileImage
)
  // done

router.get(
  "/me/profile-image",
  authenticate,
  getMyProfileImage
);
router.post("/onboarding/complete", authenticate, completeOnboarding);   // done
router.get("/search", authenticate, searchUsers);
router.get("/search2", authenticate, searchUsers2);
router.patch("/privacy", authenticate, updatePrivacy);
router.delete("/deactivate", authenticate, deactivateAccount);
router.get("/:userId/profile", authenticate, getUserProfile);
router.get(
  "/:userId",
  authenticate, // viewer may be logged out
  getUserProfileById
);

export default router;
