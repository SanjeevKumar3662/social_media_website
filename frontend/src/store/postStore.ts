import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { PostType } from "../types/post";
import toast from "react-hot-toast";

type PostStore = {
  posts: PostType[];
  cursor: string | null;
  getAllPost: (cursor?: string | null) => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
};

export const userPostStore = create<PostStore>((set) => ({
  posts: [],
  cursor: null,

  getAllPost: async (cursor) => {
    try {
      const res = await axiosInstance.get("/posts/", {
        params: {
          limit: 10,
          cursor: cursor ?? undefined,
        },
        withCredentials: true,
      });

      set((state) => ({
        posts: cursor
          ? [...state.posts, ...res.data.posts] // append
          : res.data.posts, // first load
        cursor: res.data.cursor,
      }));

      console.log("Fetched posts:", res.data);
    } catch (error) {
      console.log("Error from fetchPost", error);
    }
  },

  createPost: async (formData) => {
    try {
      const res = await axiosInstance.post("/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Optional: prepend new post to feed
      set((state) => ({
        posts: [res.data, ...state.posts],
      }));

      toast.success("Post Created Successfully");
    } catch (error) {
      console.log("Error in createPost : ", error);
    }
  },
}));
