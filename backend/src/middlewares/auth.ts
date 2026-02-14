import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";
import { User } from "../models/user.model.js";

// interface user {
//   _id: string;
// }

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User does not exists" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token not valid" });
  }
};
