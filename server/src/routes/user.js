import { Router } from "express";
import { followUser, unfollowUser, getUserById } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/:id/follow", requireAuth, followUser);
router.delete("/:id/follow", requireAuth, unfollowUser);
router.get("/:id", requireAuth, getUserById);

export default router;
