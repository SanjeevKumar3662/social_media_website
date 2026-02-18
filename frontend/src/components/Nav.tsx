import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

type NavProps = {
  togglePostModal: () => void;
};

export const Nav = ({ togglePostModal }: NavProps) => {
  const { authUser, logoutUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-[#0f1f3d] px-4 py-3">
        <span className="text-white font-semibold">DevSocial</span>
        <button onClick={() => setIsOpen(true)} className="text-white text-xl">
          ☰
        </button>
      </div>

      {/* Overlay (Mobile Only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 bg-[#0f1f3d] border-r border-white/10
          px-6 py-8 flex flex-col justify-between
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Top Section */}
        <div>
          <a href="/" className="text-white font-bold text-xl tracking-wide">
            DevSocial
          </a>

          <nav className="mt-10 flex flex-col gap-4">
            <a
              href="/"
              className="text-gray-300 hover:text-white transition text-sm"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>

            <Link to={`/${authUser?.username}`}>
              <button
                className="text-left text-gray-300 hover:text-white transition text-sm"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </button>
            </Link>

            <button
              className="text-left text-gray-300 hover:text-white transition text-sm"
              onClick={() => setIsOpen(false)}
            >
              Bookmarks
            </button>

            <button
              className="bg-blue-400 px-4 py-2 rounded-md"
              onClick={togglePostModal}
            >
              Post
            </button>
          </nav>
        </div>

        {/* Bottom Section */}
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          Logout
        </button>
      </aside>
    </>
  );
};
