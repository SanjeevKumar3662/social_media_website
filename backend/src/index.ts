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
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);

app.use(errorMiddleware());

await connectDB();

app.listen(PORT, () => {
  console.log("Server running on Port :", PORT);
});
