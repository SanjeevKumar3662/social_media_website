import bcrypt from "bcryptjs";
import { RequestHandler } from "express";

import { generateToken } from "../utils/utils.js";
import { User } from "../models/user.model.js";
import { loginSchema, registerSchema } from "../vaidations/user.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import { file } from "zod";

export const registerUser: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Validation Failed" });
  }

  const { fullname, username, email, password } = parsed.data;

  const isDupUser = await User.findOne({ $or: [{ username }, { email }] });

  if (isDupUser) {
    return res.status(400).json({ message: "Duplicate User" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullname,
    username,
    email,
    password: hashedPassword,
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Failed To Create a User : Invalid Data" });
  }

  generateToken({ _id: user._id.toString() }, res);
  return res.status(201).json({
    fullname: user.fullname,
    username: user.username,
    email: user.email,
  });
});

export const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Validation Failed" });
  }

  const { username, password } = parsed.data;

  const user = await User.findOne({ username }).select("password");

  if (!user) {
    return res.status(400).json({ message: "Invalid Credientials" });
  }

  const isPassowordValid = await bcrypt.compare(password, user.password);

  if (!isPassowordValid) {
    return res.status(400).json({ message: "Invalid Credientials" });
  }

  generateToken({ _id: user._id.toString() }, res);

  return res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
  });
});

export const logoutUser: RequestHandler = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: process.env.MODE !== "DEV" ? "none" : "lax",
      secure: process.env.MODE !== "DEV",
    })
    .json({ message: "Logged out Successfully" });
});

export const authMe = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
});

export const getUserProifle = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const limit = Number(req.query.limit) || 10; // get the limit
  const cursor = (req.query.cursor as string) || undefined; // cursor from req

  if (!username) {
    return res.status(400).json({ message: "User's username is required" });
  }

  // later add bio profilePic and background
  const user = await User.findOne({ username }).select(
    "username fullname bio profilePic coverPic",
  );

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  let query: any = { userId: user?._id, isPublic: true };

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
    user,
    posts: posts.map((post) => {
      return {
        ...post.toObject(),
        user: post.userId,
        userId: undefined,
      };
    }),
    cursor: posts.length > 0 ? posts[posts.length - 1].createdAt : null,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullname, bio } = req.body;

  // const user = await User.findById(req.user?._id);

  // get files from multer middleware
  const files = req.files as {
    profilePic?: Express.Multer.File[];
    coverPic?: Express.Multer.File[];
  };

  // upload files to cloudinary
  let profilePic;
  let coverPic;

  if (files?.profilePic) {
    const uploadRes = await cloudinary.uploader.upload(
      files.profilePic?.[0].path,
    );

    if (!uploadRes) {
      return res
        .status(500)
        .json({ message: "Faild to upload the profilePic" });
    }

    profilePic = {
      url: uploadRes?.secure_url,
      public_id: uploadRes?.public_id,
    };

    console.log("profilePic", profilePic);
  }

  if (files?.coverPic) {
    const uploadRes = await cloudinary.uploader.upload(
      files?.coverPic?.[0].path,
    );

    if (!uploadRes) {
      return res.status(500).json({ message: "Failed to upload coverPic" });
    }

    coverPic = {
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
    };
  }

  const updateData: any = {
    fullname,
    bio,
  };

  if (profilePic) updateData.profilePic = profilePic;
  if (coverPic) updateData.coverPic = coverPic;

  const user = await User.findByIdAndUpdate(req.user?._id, updateData, {
    returnDocument: "after",
  });

  if (!user) {
    return res.status(401).json({ message: "Failed to update the user" });
  }

  console.log(user);

  return res.status(200).json(user);
});
