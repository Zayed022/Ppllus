import { Router } from "express";
import { createComment, deleteComment, getCommentLikes, getCommentReplies, getComments, toggleLikeComment } from "../controllers/comment.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";


const router = Router();

router.post("/posts/:postId/comments", authenticate, createComment);
router.post("/reels/:reelId/comments", authenticate, createComment);

router.get("/posts/:postId/comments", authenticate, getComments);
router.get("/reels/:reelId/comments", authenticate, getComments);

router.get("/comments/:commentId/replies", authenticate, getCommentReplies);

router.delete("/comments/:commentId", authenticate, deleteComment);

router.post("/comments/:commentId/like", authenticate, toggleLikeComment);
router.get("/comments/:commentId/likes", authenticate, getCommentLikes);


export default router;
