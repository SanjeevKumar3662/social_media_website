import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import type { AuthState } from "../types/auth";
import { userPostStore } from "./postStore";

// updateUserProfile: any,
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,

  checkUser: async () => {
    try {
      const res = await axiosInstance.get("/user/me");
      console.log("inAuth", res);
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.log("error form checkUser : ", error);
      toast.error(`Failed to check user :`);
    }
  },

  registerUser: async (userData) => {
    try {
      const res = await axiosInstance.post("/user/register", userData);
      set({ authUser: res.data });
      toast.success("User registered");
      console.log("userdata form register user :", res.data);
    } catch (error) {
      console.log("error form registerUser : ", error);
      toast.error(`Failed to register user :`);
    }
  },

  loginUser: async (userData) => {
    try {
      const res = await axiosInstance.post("/user/login", userData);
      set({ authUser: res.data });
      toast.success("User login successful");
      console.log("userdata form login user :", res.data);
    } catch (error) {
      console.log("error form loginUser : ", error);
      toast.error(`Failed to login user :`);
    }
  },
  logoutUser: async () => {
    try {
      const res = await axiosInstance.post("/user/logout");
      set({ authUser: null });
      toast.success("User login");
      console.log("userdata form login user :", res.data);
    } catch (error) {
      console.log("error form loginUser : ", error);
      toast.error(`Failed to login user :`);
    }
  },
  updateUserProfile: async (formData: FormData) => {
    try {
      const res = await axiosInstance.patch("/user/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ authUser: res.data });

      userPostStore.setState({
        userProfile: res.data,
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  },
}));
