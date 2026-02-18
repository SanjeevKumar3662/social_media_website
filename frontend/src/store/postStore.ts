import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { PostType } from "../types/post";
import toast from "react-hot-toast";

type PostStore = {
  posts: PostType[];
  cursor: string | null;

  userProfile: {
    _id: string;
    username: string;
    fullname: string;
    bio: string;
    profilePic: { url: string; public_id: string };
    coverPic: { url: string; public_id: string };
  } | null;
  profilePosts: PostType[];
  profileCursor: string | null;

  getAllPost: (cursor?: string | null) => Promise<void>;
  getUserProfile: (username: string, cursor?: string | null) => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
};

export const userPostStore = create<PostStore>((set) => ({
  posts: [],
  cursor: null,

  userProfile: null,
  profilePosts: [],
  profileCursor: null,

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
  getUserProfile: async (username, cursor) => {
    console.log("getUserProfile args", username, cursor);
    try {
      const res = await axiosInstance.get(`/user/${username}`, {
        params: {
          limit: 10,
          cursor: cursor ?? undefined,
        },
        withCredentials: true,
      });

      set((state) => ({
        profilePosts: cursor
          ? [...state.profilePosts, ...res.data.posts] // append
          : res.data.posts, // first load
        profileCursor: res.data.cursor,
        userProfile: res.data.user,
      }));

      console.log("Fetched ProfilePosts:", res.data);
    } catch (error) {
      console.log("Error from getUserPost", error);
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
      console.log("post created", res.data);

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
