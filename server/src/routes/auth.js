import { Router } from "express";
import { register, login, logout, me, refresh,updateProfile} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/refresh", refresh);
router.put("/profile", requireAuth, upload.single("avatar"), updateProfile);

export default router;
