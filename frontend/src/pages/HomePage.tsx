import { useEffect, useRef, useState } from "react";
import { Post } from "../components/Post";
import { userPostStore } from "../store/postStore";
import { PostModal } from "../components/PostModal";
import { Toaster } from "react-hot-toast";

export const HomePage = () => {
  const { posts, cursor, getAllPost } = userPostStore();
  const [showPostModal, setShowPostModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getAllPost(); // initial load
  }, [getAllPost]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];

        if (first.isIntersecting && cursor && !isFetching) {
          setIsFetching(true);
          await getAllPost(cursor);
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
  }, [cursor, getAllPost, isFetching]);

  const togglePostModal = () => {
    setShowPostModal((prev) => !prev);
  };

  return (
    <div className="flex-1 bg-blue-900 p-6 flex flex-col items-center gap-4">
      <Toaster position="top-right" />

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
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}

      {/* Loader Trigger */}
      {cursor && (
        <div
          ref={loaderRef}
          className="h-10 flex items-center justify-center text-white"
        >
          {isFetching && <span>Loading...</span>}
        </div>
      )}
    </div>
  );
};
