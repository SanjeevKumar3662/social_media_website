import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { PostType } from "../types/post";
import toast from "react-hot-toast";

type CommnetType = {
  _id: string;
  postId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: {
    _id: string;
    username: string;
    profilePic: {
      url: string;
    };
  };
};

type PostStore = {
  // updateUserProfile: any;
  posts: PostType[];
  postComments: CommnetType[];
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

  showPostModal: boolean;
  togglePostModal: () => void;
  setShowPostModal: (arg0: boolean) => void;

  getAllPost: (cursor?: string | null) => Promise<void>;
  getUserProfile: (username: string, cursor?: string | null) => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
  deletePost: (postId: string) => Promise<number | undefined>;
  getPostComments: (postId: string) => Promise<void>;
  createComment: (postId: string, comment: string) => Promise<void>;
};

export const userPostStore = create<PostStore>((set) => ({
  posts: [],
  cursor: null,
  postComments: [],

  userProfile: null,
  profilePosts: [],
  profileCursor: null,
  // postStore.ts
  showPostModal: false,
  setShowPostModal: (value: boolean) => set({ showPostModal: value }),
  togglePostModal: () =>
    set((state) => ({ showPostModal: !state.showPostModal })),

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

      // console.log("Fetched posts:", res.data);
    } catch (error) {
      console.log("Error from fetchPost", error);
    }
  },
  getUserProfile: async (username, cursor) => {
    // console.log("getUserProfile args", username, cursor);
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

      // console.log("Fetched ProfilePosts:", res.data);
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
      // console.log("post created", res.data);

      // Optional: prepend new post to feed
      set((state) => ({
        posts: [res.data, ...state.posts],
      }));

      toast.success("Post Created Successfully");
    } catch (error) {
      console.log("Error in createPost : ", error);
    }
  },
  deletePost: async (postId: string) => {
    try {
      const res = await axiosInstance.delete(`/posts/${postId}`);

      toast.success("Post deleted");
      return res.status;
    } catch (error) {
      console.log("Error in Delete Post :", error);
      toast.error("Failed to delete Post");
    }
  },
  getPostComments: async (postId: string) => {
    try {
      const res = await axiosInstance.get(`/comments/${postId}`);
      // console.log("getPostComments", res);
      // return res.data;
      set({ postComments: res.data });
    } catch (error) {
      toast.error("Failed to getComments");
      console.log("Error in getPostComments", error);
    }
  },
  createComment: async (postId: string, comment: string) => {
    try {
      const res = await axiosInstance.post(
        `/comments/${postId}`,
        { comment },
        {
          withCredentials: true,
        },
      );
      set((state) => ({ postComments: [res.data, ...state.postComments] }));
      // console.log("createComment", res);
      toast.success("Comment posted successfully");
      return res.data;
    } catch (error) {
      toast.error("Failed to post a comment");
      console.error("Error in getPostComments", error);
    }
  },
}));
