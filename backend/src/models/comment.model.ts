import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Post } from "./post.model.js";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      maxLength: 1000,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
