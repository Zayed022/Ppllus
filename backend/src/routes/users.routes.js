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
import { upload } from "../middlewares/multer.middlewares.js";

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
router.route("/profile/image").patch(
  upload.fields([
      {
          name:"profileImage",
          maxCount:1
      }
  ]),
  authenticate, updateProfileImage
)  // done
router.post("/onboarding/complete", authenticate, completeOnboarding);   // done
router.get("/search", authenticate, searchUsers);
router.patch("/privacy", authenticate, updatePrivacy);
router.delete("/deactivate", authenticate, deactivateAccount);

export default router;
