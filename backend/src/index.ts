import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/db.js";
import userRouter from "../src/routes/user.route.js";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", userRouter);

await connectDB();

app.listen(PORT, () => {
  console.log("Server running on Port :", PORT);
});
