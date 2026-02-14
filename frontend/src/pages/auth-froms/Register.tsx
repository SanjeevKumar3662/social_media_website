import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const { registerUser } = useAuthStore();

  const handleOnSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await registerUser({ fullname, username, email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-[#1A3263] to-[#0f1f3d] px-4">
      <div className="w-full max-w-md bg-[#1f3c6d] text-white p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Create Account
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">Join us today</p>

        <form className="space-y-5" onSubmit={handleOnSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="fullname" className="text-sm text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#2a4d85] border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-[#305a9e] transition"
            />
          </div>

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

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#2a4d85] border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-[#305a9e] transition"
            />
          </div>

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

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition py-2 rounded-lg font-medium shadow-md"
          >
            Register
          </button>

          <p className="text-sm text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
