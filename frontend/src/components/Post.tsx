import type { PostType } from "../types/post";
import { useState } from "react";

import {
  ArrowLeft,
  MessageCircle,
  MoveRight,
  Share,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { userPostStore } from "../store/postStore";
import { useAuthStore } from "../store/authStore";
import { MessegeModal } from "./MessegeModal";

type PostProps = {
  post: PostType;
};

export const Post = ({ post }: PostProps) => {
  const { text, votes } = post;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showMessegeModal, setShowMessegeModal] = useState(false);

  const { deletePost } = userPostStore();
  const { authUser } = useAuthStore();

  const next = () => {
    setDirection(1);
    setCurrent((prev) => prev + 1);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => prev - 1);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const media = [];

  if (post.image?.url) {
    media.push({ type: "image", url: post.image.url });
  }

  if (post.video?.url) {
    media.push({ type: "video", url: post.video.url });
  }

  if (isDeleted) {
    return <></>;
  }

  return (
    <div className="max-w-2xl w-full bg-[#1f3c6d] text-white rounded-2xl shadow-xl border border-white/10 p-5 flex flex-col gap-4  ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
            U
          </div>
          <div className="flex flex-col">
            <Link to={`/profile/${post.user.username}`}>
              <button className="text-sm font-semibold hover:underline cursor-pointer">
                {post.user.username}
              </button>
            </Link>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        {authUser?._id === post.user._id && (
          <button
            className="cursor-pointer hover:bg-gray-300 hover:text-black rounded-2xl"
            onClick={async () => {
              const status = await deletePost(post._id);

              if (status === 200) setIsDeleted(true);
            }}
          >
            <X />
          </button>
        )}
      </div>
      {/* Content */}
      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap wrap-break-word ">
        {text ? text : `Lorem ipsum dolor sit amet `}
      </p>

      {media.length > 0 && (
        <div className="mt-3 relative rounded-2xl overflow-hidden border border-white/10 bg-black">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              variants={variants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onDragEnd={(_e, { offset }) => {
                const swipe = offset.x;

                if (swipe < -100 && current < media.length - 1) {
                  setDirection(1);
                  setCurrent((prev) => prev + 1);
                } else if (swipe > 100 && current > 0) {
                  setDirection(-1);
                  setCurrent((prev) => prev - 1);
                }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              className="w-full"
            >
              {media[current].type === "image" ? (
                <img
                  src={media[current].url}
                  alt="Post media"
                  className="w-full object-cover max-h-[60vh]"
                />
              ) : (
                <video
                  src={media[current].url}
                  controls
                  preload="metadata"
                  className="w-full max-h-[60vh]"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          {current > 0 && (
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ArrowLeft />
            </button>
          )}

          {/* Right Arrow */}
          {current < media.length - 1 && (
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <MoveRight />
            </button>
          )}

          {/* Dots */}
          {media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {media.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === current ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-blue-400 transition">
            <ThumbsUp />
          </button>
          <span>{votes}</span>
          <button className="flex items-center gap-1 hover:text-red-400 transition">
            <ThumbsDown />
          </button>

          <button
            onClick={() => setShowMessegeModal((value) => !value)}
            className="hover:text-green-400 transition"
          >
            <MessageCircle />
          </button>
        </div>

        <button className="hover:text-yellow-400 transition">
          <Share />
        </button>
      </div>

      {showMessegeModal && (
        <MessegeModal
          postId={post._id}
          setShowMessegeModal={setShowMessegeModal}
        />
      )}
    </div>
  );
};
