import { RequestHandler } from "express";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import cloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPost: RequestHandler = asyncHandler(async (req, res) => {
  const user = req?.user;
  // console.log(user);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { text } = req.body;

  // get files from multer middleware
  const files = req.files as {
    image?: Express.Multer.File[];
    video?: Express.Multer.File[];
  };

  // upload them to cloudinary then store it in these vars
  let imageData;
  let videoData;

  //uploading image
  if (files?.image) {
    const uploadRes = await uploadOnCloudinary(files.image?.[0].path);

    if (!uploadRes) {
      return res.status(500).json({ message: "Failed to upload the Image" });
    }

    imageData = {
      url: uploadRes?.secure_url,
      public_id: uploadRes?.public_id,
    };
  }

  // uploding video
  if (files?.video) {
    const uploadRes = await uploadOnCloudinary(files.video?.[0].path);

    if (!uploadRes) {
      return res.status(500).json({ message: "Failed to upload the Video" });
    }
    videoData = {
      url: uploadRes?.secure_url,
      public_id: uploadRes?.public_id,
    };
  }

  const post = await Post.create({
    userId: user._id,
    text,
    image: imageData,
    video: videoData,
  });

  const populatedPost = await post.populate("userId", "username fullname");

  return res.status(201).json({
    ...populatedPost.toObject(),
    user: populatedPost.userId,
    userId: undefined,
  });
});

export const deletePost: RequestHandler = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.userId.toString() !== user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (post.image?.public_id) {
    await cloudinary.uploader.destroy(post.image?.public_id);
  }

  if (post.video?.public_id) {
    await cloudinary.uploader.destroy(post.video?.public_id, {
      resource_type: "video",
    });
  }

  const deletedPost = await Post.findByIdAndDelete(post._id);

  return res.status(200).json(deletedPost);
});

export const getPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!post.isPublic) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (post.userId.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  return res.status(200).json(post);
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10; // get the limit
  const cursor = (req.query.cursor as string) || undefined; // cursor from req

  let query: any = { isPublic: true };

  if (cursor) {
    // if cursor exists then add this to query
    query.createdAt = { $lt: new Date(cursor) };
  }

  // then find it sort it by newest with the limit
  // 1 -> ascending
  // -1 -> descending

  const posts = await Post.find(query)
    .populate("userId", "username fullname")
    .sort({ createdAt: -1 })
    .limit(limit);
  return res.status(200).json({
    posts: posts.map((post) => ({
      ...post.toObject(),
      user: post.userId,
      userId: undefined,
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    })),
    cursor: posts.length > 0 ? posts[posts.length - 1].createdAt : null,
  });
});

export const toggleLike: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const userId = user._id.toString();

  // remove from dislikes if exists
  post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);

  if (post.likes.includes(user._id)) {
    // already liked → remove like
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    // add like
    post.likes.push(user._id);
  }

  await post.save();

  return res.status(200).json({
    likes: post.likes.length,
    dislikes: post.dislikes.length,
  });
});

export const toggleDislike: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const userId = user._id.toString();

  // remove from likes if exists
  post.likes = post.likes.filter((id) => id.toString() !== userId);

  if (post.dislikes.includes(user._id)) {
    // already disliked → remove
    post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
  } else {
    // add dislike
    post.dislikes.push(user._id);
  }

  await post.save();

  return res.status(200).json({
    likes: post.likes.length,
    dislikes: post.dislikes.length,
  });
});
