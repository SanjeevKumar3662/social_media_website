import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { userPostStore } from "../store/postStore";
import toast from "react-hot-toast";

export const Nav = () => {
  const { authUser, logoutUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const { togglePostModal } = userPostStore();

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-[#0f1f3d] px-4 py-3 border-b border-white/10">
        <Link to={"/"}>
          <span className="text-white font-semibold tracking-wide">
            DevSocial
          </span>
        </Link>
        <div className="flex gap-3">
          {authUser ? (
            <button
              onClick={handleLogout}
              className="w-full bg-white/5 hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link to={"/login"}>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-white/5 hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white"
              >
                Login
              </button>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-300 hover:text-white transition"
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>

      {/* Overlay (Mobile Only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
      fixed top-0 left-0 z-50
      h-screen w-64
      bg-[#0f1f3d]
      border-r border-white/10
      px-6 py-8
      flex flex-col justify-between
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}
      >
        {/* Top Section */}
        <div>
          <a href="/" className="text-white font-bold text-2xl tracking-wide">
            DevSocial
          </a>

          <nav className="mt-12 flex flex-col gap-2">
            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
            >
              Home
            </a>

            {authUser && (
              <Link
                to={`/profile/${authUser?.username}`}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
              >
                Profile
              </Link>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
            >
              Bookmarks
            </button>

            {/* Post Button */}
            <button
              onClick={() => {
                if (!authUser) {
                  toast.error("Please Login to create a Post!");
                  return;
                }
                togglePostModal();
                setIsOpen(false);
              }}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-full font-medium shadow"
            >
              Post
            </button>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-white/10">
          {authUser ? (
            <button
              onClick={handleLogout}
              className="w-full bg-white/5 hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link to={"/login"}>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-white/5 hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white"
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
