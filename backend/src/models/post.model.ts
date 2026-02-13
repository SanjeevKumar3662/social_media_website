import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
      maxLength: 1000,
    },
    image: {
      url: String,
      public_id: String,
    },
    video: {
      url: String,
      public_id: String,
    },

    votes: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
