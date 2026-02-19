import { Image, LoaderPinwheel, Video, X } from "lucide-react";

import { usePostComposer } from "../hooks/usePostComposer";
import { useAuthStore } from "../store/authStore";

export const PostComposer = () => {
  const { authUser } = useAuthStore();

  const {
    text,
    image,
    video,
    setText,
    setImage,
    setVideo,
    handleSubmit,
    isSubmitting,
  } = usePostComposer();

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="max-w-2xl w-full bg-[#1f3c6d] text-white rounded-2xl shadow-xl border border-white/10 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold   w-full text-center animate-bounce ">
          {authUser ? "Create Post" : "Please login to use all features"}
        </h2>
      </div>

      {!isSubmitting ? (
        <form onSubmit={handleForm} className="flex flex-col gap-4">
          <textarea
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="
          w-full resize-none
          bg-[#2a4d85]
          rounded-xl
          p-3
          focus:outline-none
          focus:ring-2
          focus:ring-blue-400
          min-h-25
        "
          />

          {(image || video) && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full object-cover max-h-[60vh]"
                />
              )}

              {video && (
                <video
                  src={URL.createObjectURL(video)}
                  controls
                  className="w-full max-h-[60vh]"
                />
              )}

              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setVideo(null);
                }}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-1 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex gap-4">
              <label className="cursor-pointer hover:text-blue-400 transition">
                <Image />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files?.[0] && setImage(e.target.files[0])
                  }
                />
              </label>

              <label className="cursor-pointer hover:text-green-400 transition">
                <Video />
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) =>
                    e.target.files?.[0] && setVideo(e.target.files[0])
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!text && !image && !video}
              className="
            bg-blue-500
            hover:bg-blue-600
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            px-4 py-2
            rounded-lg
            font-medium
          "
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center flex justify-center gap-3 cursor-progress">
          <span>Loading..</span>
          <LoaderPinwheel className="animate-spin" />
        </div>
      )}
    </div>
  );
};
