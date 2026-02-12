import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";

// interface user {
//   _id: string;
// }

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token not valid" });
  }
};
