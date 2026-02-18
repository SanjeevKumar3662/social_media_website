import { useEffect, useRef, useState } from "react";
import { Post } from "../components/Post";
import { userPostStore } from "../store/postStore";
import { PostModal } from "../components/PostModal";
import { Toaster } from "react-hot-toast";
import { Nav } from "../components/Nav";
import { useParams } from "react-router-dom";

export const ProfilePage = () => {
  const { userProfile, profilePosts, profileCursor, getUserProfile } =
    userPostStore();
  const [showPostModal, setShowPostModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { username } = useParams();

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

  console.log("profile post in propage :", userProfile);

  return (
    <div className="min-h-screen bg-blue-900">
      <Nav togglePostModal={togglePostModal} />

      {/* Main Content */}
      <div className="md:ml-64 p-6 flex flex-col items-center gap-4">
        <Toaster position="top-right" />
        <h1 className="text-6xl"> {userProfile?.username}</h1>

        {/* Create Post Button */}
        <div className="max-w-xl w-full bg-[#1f3c6d] text-white rounded-2xl shadow-xl border border-white/10 p-5">
          <button
            className="bg-blue-400 px-4 py-2 rounded-md"
            onClick={togglePostModal}
          >
            Post
          </button>
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
