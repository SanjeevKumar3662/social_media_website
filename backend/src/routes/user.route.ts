import { Router } from "express";

import {
  authMe,
  getUserProifle,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, authMe);
router.get("/:username", getUserProifle);
router.patch(
  "/",
  authMiddleware,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  updateUserProfile,
);

export default router;
