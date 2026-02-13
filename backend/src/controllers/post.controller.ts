import { RequestHandler } from "express";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import cloudinary from "../utils/cloudinary.js";

export const createPost: RequestHandler = async (req, res) => {
  const user = req?.user;
  console.log(user);

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
};
