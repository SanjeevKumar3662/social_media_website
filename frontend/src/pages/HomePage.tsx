import { useEffect, useRef, useState } from "react";
import { Post } from "../components/Post";
import { userPostStore } from "../store/postStore";
import { PostModal } from "../components/PostModal";
import { Toaster } from "react-hot-toast";
import { Nav } from "../components/Nav";
import { PostComposer } from "../components/PostComposer";
// import { SearchIcon } from "lucide-react";

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
    <div className="min-h-screen w-full bg-blue-900 overflow-x-hidden">
      <Nav togglePostModal={togglePostModal} />

      {/* Main Content */}
      <div className="md:ml-64 p-6 flex flex-col items-center gap-4">
        <Toaster position="top-right" />

        <PostComposer />

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
    </div>
  );
};
