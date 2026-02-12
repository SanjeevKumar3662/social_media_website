import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minlen: 3,
      maxlen: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlen: 3,
      maxlen: 60,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
