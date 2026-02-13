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

  return res.status(201).json(post);
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
