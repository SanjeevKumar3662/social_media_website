import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://social-media-website-tw1w.onrender.com",
    ],
    credentials: true,
  }),
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);

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
