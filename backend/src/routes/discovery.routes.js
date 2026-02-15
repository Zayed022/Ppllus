import { Router } from "express";
import { getSuggestedUsers } from "../controllers/discovery.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/suggested-users",authenticate, getSuggestedUsers);

export default router;
