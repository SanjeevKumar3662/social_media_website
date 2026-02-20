import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  toggleDislike,
  toggleLike,
} from "../controllers/post.controller.js";
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

router.delete("/:postId", authMiddleware, deletePost);

router.get("/", getAllPosts);
router.get("/:postId", getPost);

router.post("/like/:postId", authMiddleware, toggleLike);
router.post("/dislike/:postId", authMiddleware, toggleDislike);

export default router;
