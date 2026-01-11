import { Router } from "express";
import { getSuggestedUsers } from "../controllers/discovery.controllers.js";

const router = Router();

router.get("/suggested-users", getSuggestedUsers);

export default router;
