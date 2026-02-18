export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  fullname: string;
}
export interface AuthState {
  authUser: AuthUser | null;
  checkUser: () => Promise<void>;
  registerUser: (userData: unknown) => Promise<void>;
  loginUser: (userData: unknown) => Promise<void>;
  logoutUser: () => Promise<void>;
}
