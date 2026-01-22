import { Router } from "express";
import { createPost, deletePost, getMyPosts, getPostById, getPostFeed, getPostsByLocation, getPostsByTag, getUserPosts, toggleLikePost } from "../controllers/post.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router();

router.post("/", authenticate, 
     upload.fields([
          {
              name:"media",                             // done
              maxCount:1
          }
      ]),
    createPost);
router.get("/feed", authenticate, getPostFeed);         // done
router.get("/me", authenticate, getMyPosts);           // 
router.get("/user/:userId", authenticate, getUserPosts); // done
router.get("/:postId", authenticate, getPostById);       // done
router.post("/:postId/like", authenticate, toggleLikePost);
router.delete("/:postId", authenticate, deletePost);
router.get("/location/nearby", authenticate, getPostsByLocation);  
router.get("/tag/:tag", authenticate, getPostsByTag);


export default router;
