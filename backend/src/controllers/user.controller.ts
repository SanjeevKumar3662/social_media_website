// export const loginUser = async (req, res) => {};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequestHandler, Response } from "express";

import { User } from "../models/user.model.js";

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
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
  } catch (error) {}
};

interface TokenPayload {
  _id: string;
}

export const generateToken = (payload: TokenPayload, res: Response) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.MODE !== "DEV" ? "none" : "lax",
    secure: process.env.MODE !== "DEV",
  });
};
