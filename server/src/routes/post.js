import { Router } from "express";
import { createPost, getFeed, toggleLike, updatePost, deletePost, getUserPosts, getPostById, likeAPost, unlikeAPost, likeCount} from "../controllers/postController.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/", requireAuth, upload.single("image"), createPost);
router.get("/feed", requireAuth, getFeed);
router.put("/:id/like", requireAuth, toggleLike);
router.put("/:id", requireAuth, upload.single("image"), updatePost);
router.delete("/:id", requireAuth, deletePost);
router.get("/user/:userId", requireAuth, getUserPosts);
router.get("/:postId", requireAuth, getPostById);
router.post("/:postId/like", requireAuth, likeAPost);
router.post("/:postId/unlike", requireAuth, unlikeAPost);
router.get("/:postId/likes", likeCount);

export default router;
