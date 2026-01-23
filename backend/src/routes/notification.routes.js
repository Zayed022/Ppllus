import { Router } from "express";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notification.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";


const router = Router();

router.get("/", authenticate, getNotifications);
router.post("/:notificationId/read", authenticate, markNotificationRead);
router.post("/read-all", authenticate, markAllNotificationsRead);


export default router;
