import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import fs from "fs";
import path from "path";

import { connectDB } from "./db/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

const PORT = process.env.PORT || 3000;

const app = express();

const tempPath = path.join(process.cwd(), "public/temp");

if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://social-media-ruby-two-85.vercel.app",
    ],
    credentials: true,
  }),
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

// health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(errorMiddleware());

await connectDB();

app.listen(PORT, () => {
  console.log("Server running on Port :", PORT);
});
