import { useState, useEffect } from "react";
import { Image, Video, X } from "lucide-react";
import { userPostStore } from "../store/postStore";

type PostModalProps = {
  onClose: () => void;
};

export const PostModal = ({ onClose }: PostModalProps) => {
  const { createPost } = userPostStore();

  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  // 🔥 Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text && !image && !video) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    await createPost(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50
bg-black/70 backdrop-blur-sm
flex items-center justify-center
p-4

"
    >
      {/* Container */}
      <div className="w-full flex items-center justify-center">
        {/* Modal */}
        <div
          className="
w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[85dvh] bg-[#1f3c6d] text-white rounded-2xl p-4 md:p-6 overflow-y-auto shadow-2xl animate-slideUp
"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold">Create Post</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Textarea */}
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
                min-h-30
              "
            />

            {/* Media Preview */}
            {(image || video) && (
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="w-full object-cover max-h-100"
                  />
                )}

                {video && (
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    className="w-full max-h-100"
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

            {/* Footer Actions */}
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
        </div>
      </div>
    </div>
  );
};
