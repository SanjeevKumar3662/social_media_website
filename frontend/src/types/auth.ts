export interface AuthUser {
  bio: string;
  profilePic: {
    url: string;
    public_id: string;
  };
  coverPic: {
    url: string;
    public_id: string;
  };
  _id: string;
  username: string;
  email: string;
  fullname: string;
}
export interface AuthState {
  authUser: AuthUser | null;
  updateUserProfile: (formData: FormData) => Promise<void>;
  checkUser: () => Promise<void>;
  registerUser: (userData: unknown) => Promise<void>;
  loginUser: (userData: unknown) => Promise<void>;
  logoutUser: () => Promise<void>;
}
