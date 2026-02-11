import "dotenv/config";
import express from "express";
import { connectDB } from "./db/db.js";

const app = express();

const PORT = 3000;

await connectDB();

app.listen(PORT, () => {
  console.log("Server running on Port :", PORT);
});
