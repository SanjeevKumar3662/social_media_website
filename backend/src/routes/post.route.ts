import { Router } from "express";
import { createPost, deletePost } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost,
);

router.delete("/", authMiddleware, deletePost);

export default router;
