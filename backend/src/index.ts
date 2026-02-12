import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/db.js";
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors());

await connectDB();

app.listen(PORT, () => {
  console.log("Server running on Port :", PORT);
});
