import { RequestHandler } from "express";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userComment = req.body.comment;
  // console.log(postId, userComment, req.user?._id);

  if (!postId) {
    return res.status(400).json({ message: "Post id is required!" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = await (
    await Comment.create({
      postId,
      userId: req.user?._id,
      comment: userComment,
    })
  ).populate("userId", "username profilePic");

  return res
    .status(201)
    .json({ ...comment.toObject(), user: comment.userId, userId: undefined });
});

export const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "Post id is required!" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const allComments = await Comment.find({ postId }).populate(
    "userId",
    "username profilePic",
  );

  return res.status(200).json([
    ...allComments.map((comment: any) => {
      return { ...comment.toObject(), user: comment.userId, userId: undefined };
    }),
  ]);
});
