import mongoose from "mongoose";

type ImageType = {
  url?: string | null;
  public_id?: string | null;
};

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
  bio?: string | null;
  profilePic?: ImageType | null;
  coverPic?: ImageType | null;
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
      select: false,
      minlength: 3,
      maxlength: 60,
    },
    bio: {
      type: String,
      maxlength: 160,
    },
    profilePic: {
      url: { type: String },
      public_id: { type: String },
    },
    coverPic: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
