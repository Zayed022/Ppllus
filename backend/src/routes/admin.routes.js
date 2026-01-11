import { Router } from "express";
import {
    getPendingReports,
    moderateReel
} from "../controllers/admin.controllers.js"

const router = Router();

router.get("/pending-reports", getPendingReports);
router.get("/moderate", moderateReel)

export default router;
