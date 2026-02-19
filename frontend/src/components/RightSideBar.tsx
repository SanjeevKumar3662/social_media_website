export const RightSideBar = () => {
  return (
    <aside
      className="
    hidden lg:flex
    fixed top-0 right-0
    h-screen w-72
    bg-[#0f1f3d]
    border-l border-white/10
    px-6 py-8
    flex-col gap-8
  "
    >
      {/* Search Section */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4 tracking-wide">
          Search
        </h2>

        <div className="relative">
          <input
            type="text"
            placeholder="Search users, posts..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Work in Progress Section */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4 tracking-wide">
          Work in Progress
        </h2>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300">
          <p className="mb-2">This section is currently under development.</p>
          <p>Upcoming features will appear here soon.</p>
        </div>
      </div>
    </aside>
  );
};
