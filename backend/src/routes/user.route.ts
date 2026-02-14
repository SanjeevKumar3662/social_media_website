import { Router } from "express";

import {
  authMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, authMe);

export default router;
