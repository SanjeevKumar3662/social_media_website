import { useEffect, useRef, useState } from "react";
import { Post } from "../components/Post";
import { userPostStore } from "../store/postStore";
import { PostModal } from "../components/PostModal";
// import { Toaster } from "react-hot-toast";
import { PostComposer } from "../components/PostComposer";
import { RightSideBar } from "../components/RightSideBar";
import { LoaderPinwheel } from "lucide-react";

// import { SearchIcon } from "lucide-react";

export const HomePage = () => {
  const { posts, cursor, getAllPost, showPostModal } = userPostStore();
  const [isFetching, setIsFetching] = useState(false);

  // console.log("showPostModal", showPostModal);

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

  return (
    <div className="min-h-screen w-full bg-blue-900 overflow-x-hidden">
      {/* Main Content */}
      <RightSideBar />

      <div className="md:ml-64 lg:mr-74 p-6 flex flex-col items-center gap-4">
        <PostComposer />

        {showPostModal && <PostModal />}

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
            {isFetching && (
              <LoaderPinwheel className="animate-spin w-15 h-15" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
