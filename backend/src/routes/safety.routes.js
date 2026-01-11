import { Router } from "express";
import { blockUser, unblockUser } from "../controllers/block.controllers.js";
import { muteUser, unmuteUser } from "../controllers/mute.controllers.js";
import { reportEntity } from "../controllers/report.controllers.js";

const router = Router();

router.post("/block/:userId", blockUser);
router.delete("/block/:userId", unblockUser);

router.post("/mute/:userId", muteUser);
router.delete("/mute/:userId", unmuteUser);

router.post("/report", reportEntity);

export default router;
