import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", authMiddleware, asyncHandler(logoutUser));

export default router;
