// export const loginUser = async (req, res) => {};
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";

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

    return;
  } catch (error) {}
};
