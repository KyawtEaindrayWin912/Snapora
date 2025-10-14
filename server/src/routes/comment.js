import { Router} from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/:id/comments", requireAuth, addComment);

router.get("/:id/comments", requireAuth, getComments);

export default router;
