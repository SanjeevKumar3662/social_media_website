import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", asyncHandler(registerUser));

export default router;
