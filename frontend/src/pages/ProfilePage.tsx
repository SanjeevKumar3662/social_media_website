import { useEffect, useRef, useState } from "react";
import { Post } from "../components/Post";
import { userPostStore } from "../store/postStore";
import { PostModal } from "../components/PostModal";
import { Toaster } from "react-hot-toast";
import { Nav } from "../components/Nav";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
// import { User } from "lucide-react";

export const ProfilePage = () => {
  const { userProfile, profilePosts, profileCursor, getUserProfile } =
    userPostStore();
  const [showPostModal, setShowPostModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { username } = useParams();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!username) {
      return;
    }
    getUserProfile(username); // initial load
  }, [getUserProfile, username]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];

        //if no username then return
        if (!username) {
          return;
        }

        if (first.isIntersecting && profileCursor && !isFetching) {
          setIsFetching(true);
          await getUserProfile(username, profileCursor);
          setIsFetching(false);
        }
      },
      { threshold: 1 },
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [profileCursor, getUserProfile, isFetching, username]);

  const togglePostModal = () => {
    setShowPostModal((prev) => !prev);
  };

  console.log("userProfile", userProfile);

  return (
    <div className="min-h-screen bg-blue-900">
      <Nav togglePostModal={togglePostModal} />

      {/* Main Content */}
      <div className="md:ml-64 p-6 flex flex-col items-center gap-4">
        <Toaster position="top-right" />

        <div className="max-w-2xl w-full bg-[#1f3c6d] text-white rounded-2xl shadow-xl border border-white/10 overflow-hidden">
          {/* Cover Image */}
          <div
            style={{
              backgroundImage: `url(${
                userProfile?.coverPic?.url ||
                "https://wallpapercave.com/wp/wp11351574.jpg"
              })`,
            }}
            className="bg-cover bg-center h-56 md:h-64 relative"
          />

          {/* Profile Info Section */}
          <div className="px-6 pb-6 relative">
            {/* Profile Picture */}
            <img
              src={
                userProfile?.profilePic?.url ||
                "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg"
              }
              alt="profile"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#1f3c6d] absolute -top-16"
            />

            {/* Edit Button */}
            {userProfile?._id === authUser?._id ? (
              <div className="flex justify-end mt-4">
                <button className="border border-gray-400 hover:bg-white/10 transition px-5 py-2 rounded-full text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="flex justify-end mt-4">
                <button className=" bg-gray-300 text-black hover:bg-gray-100 transition px-5 py-2 rounded-full text-md font-medium cursor-pointer">
                  Follow
                </button>
              </div>
            )}

            {/* User Details */}
            <div className="mt-16">
              {/* Full Name */}
              <h2 className="text-2xl font-bold">
                {userProfile?.fullname || "Full Name"}
              </h2>

              {/* Username */}
              <p className="text-gray-400 text-sm">@{userProfile?.username}</p>

              {/* Bio */}
              <p className="mt-3 text-gray-200 max-w-2xl">
                {userProfile?.bio ||
                  "This is the bio section. Add something cool here."}
              </p>

              {/* Extra Meta Info */}
              <div className="flex gap-6 mt-4 text-sm text-gray-400">
                <span> Location</span>
                <span>Website</span>
                <span>Joined Feb 2026</span>
              </div>
            </div>
          </div>
        </div>

        {showPostModal && <PostModal onClose={togglePostModal} />}

        {/* Posts */}
        {profilePosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {/* Loader Trigger */}
        {profileCursor && (
          <div
            ref={loaderRef}
            className="h-10 flex items-center justify-center text-white"
          >
            {isFetching && <span>Loading...</span>}
          </div>
        )}
      </div>
    </div>
  );
};
