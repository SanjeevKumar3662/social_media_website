import { useEffect, useRef, useState } from "react";
import { Post } from "../components/Post";
import { userPostStore } from "../store/postStore";
import { PostModal } from "../components/PostModal";
import { Toaster } from "react-hot-toast";

import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { RightSideBar } from "../components/RightSideBar";
import { UpdateProfileModal } from "../components/UpdateProfileModal";

export const ProfilePage = () => {
  const {
    userProfile,
    profilePosts,
    profileCursor,
    getUserProfile,
    showPostModal,
  } = userPostStore();
  // const [showPostModal] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
  }, [profileCursor, isFetching, username, getUserProfile]);

  console.log("userProfile", userProfile);

  return (
    <div className="min-h-screen flex justify-center flex-row-reverse  border-white bg-blue-900">
      <RightSideBar />

      {/* Main Content */}
      <div className="md:ml-64 lg:mr-74 p-6 flex flex-col items-center gap-4">
        <Toaster position="top-right" />

        {showPostModal && <PostModal />}
        {showEditModal && (
          <UpdateProfileModal setShowEditModal={setShowEditModal} />
        )}

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
                <button
                  onClick={() => {
                    setShowEditModal(true);
                  }}
                  className="border border-gray-400 hover:bg-white/10 transition px-5 py-2 rounded-full text-sm font-medium"
                >
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
              <pre className="mt-3 text-gray-200 max-w-2xl whitespace-pre-wrap wrap-break-word text-sm font-mono leading-tight tracking-tight">
                {userProfile?.bio ||
                  "This is the bio section. Add something cool here."}
              </pre>
            </div>
          </div>
        </div>

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
