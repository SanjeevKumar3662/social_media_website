import { useAuthStore } from "../store/authStore";

export const Nav = () => {
  const { logoutUser } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <nav className="w-full bg-[#0f1f3d] border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-1">
      {/* Logo / Brand */}
      <a
        href="/"
        className="text-white font-semibold text-lg tracking-wide hover:text-blue-400 transition"
      >
        DevSocial
      </a>

      {/* Links */}
      <div className="flex items-center gap-6">
        <a
          href="/"
          className="text-gray-300 hover:text-white transition text-sm"
        >
          Home
        </a>

        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
