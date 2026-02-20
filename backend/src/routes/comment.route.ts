import { Router } from "express";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/:postId", getPostComments);
router.post("/:postId", authMiddleware, createComment);

export default router;
