import bcrypt from "bcryptjs";
import { RequestHandler } from "express";

import { generateToken } from "../utils/utils.js";
import { User } from "../models/user.model.js";
import { registerSchema } from "../vaidations/user.validation.js";

export const registerUser: RequestHandler = async (req, res) => {
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
};

export const loginUser: RequestHandler = async (req, res) => {};
