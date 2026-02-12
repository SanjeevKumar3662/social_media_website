import jwt from "jsonwebtoken";
import { Response } from "express";

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
