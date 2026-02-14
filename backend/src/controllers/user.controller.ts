import bcrypt from "bcryptjs";
import { RequestHandler } from "express";

import { generateToken } from "../utils/utils.js";
import { User } from "../models/user.model.js";
import { loginSchema, registerSchema } from "../vaidations/user.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
  return res.status(201).json({ user });
});

export const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Validation Failed" });
  }

  const { username, password } = parsed.data;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "Invalid Credientials" });
  }

  const isPassowordValid = await bcrypt.compare(password, user.password);

  if (!isPassowordValid) {
    return res.status(400).json({ message: "Invalid Credientials" });
  }

  generateToken({ _id: user._id.toString() }, res);

  return res.status(200).json(user);
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
