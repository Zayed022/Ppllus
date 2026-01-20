import { Router } from "express";
import { getPostFeed } from "../controllers/post.controllers";
import { homeFeed } from "../controllers/home.controllers";


const router = Router();

router.get("/feed", authenticate, getPostFeed);
router.get("/home", authenticate, homeFeed);



export default router;
