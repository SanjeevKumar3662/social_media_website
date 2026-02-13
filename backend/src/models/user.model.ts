import mongoose from "mongoose";

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
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
      minlength: 3,
      maxlength: 60,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
