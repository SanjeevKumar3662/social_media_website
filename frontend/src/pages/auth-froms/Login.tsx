import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const { loginUser } = useAuthStore();

  const validateForm = () => {
    if (username.length < 5) {
      toast.error("Username must be min 5 characters");
      return true;
    }

    if (password.length < 8) {
      toast.error("password must be min 8 characters");
      return true;
    }
  };

  const handleOnSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      return;
    }
    await loginUser({ username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-[#1A3263] to-[#0f1f3d] px-4">
      <div className="w-full max-w-md bg-[#1f3c6d] text-white p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Sign in to continue
        </p>

        <form className="space-y-5" onSubmit={handleOnSubmit}>
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#2a4d85] border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-[#305a9e] transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <input
              type={hidePassword ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 pr-10 rounded-lg bg-[#2a4d85] border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-[#305a9e] transition"
            />

            <button
              type="button"
              onClick={() => setHidePassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-300 hover:text-white transition"
            >
              {hidePassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end text-sm">
            <a
              href="/forgot-password"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition py-2 rounded-lg font-medium shadow-md"
          >
            Login
          </button>

          {/* Register Link */}
          <p className="text-sm text-gray-400 text-center mt-4">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
