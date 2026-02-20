import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { userPostStore } from "../store/postStore";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

type PropType = {
  postId: string;
  setShowMessegeModal: Dispatch<SetStateAction<boolean>>;
};

export const MessegeModal = ({ postId, setShowMessegeModal }: PropType) => {
  const { postComments, createComment, getPostComments } = userPostStore();

  const [text, setText] = useState("");

  const { authUser } = useAuthStore();

  useEffect(() => {
    (async () => {
      await getPostComments(postId);
    })();
  }, [getPostComments, postId]);

  // console.log("postComments", postComments);
  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (text.trim() === "") {
      toast.error("Add text to comment");
      setText("");
      return;
    }

    try {
      await createComment(postId, text);
      setText("");
    } catch (error) {
      console.log("Failed to create a comment ", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[85dvh] bg-[#1f3c6d] text-white rounded-2xl p-4 md:p-6 overflow-y-auto shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
            <h2 className="text-xl md:text-2xl font-semibold">Comments</h2>

            <button
              onClick={() => setShowMessegeModal(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
            >
              ✕
            </button>
          </div>

          <form className="pb-3" onSubmit={(e) => handleFormSubmit(e)}>
            <div className="flex flex-row gap-2">
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
      min-h-24
    "
              />

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (!authUser) {
                      toast.error("Login is required to comment");
                    }
                  }}
                  type="submit"
                  // disabled={!text.trim()}
                  className="
        px-5 py-2
        rounded-lg
        bg-blue-500
        hover:bg-blue-600
        active:scale-95
        transition
        font-medium
        text-sm
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
                >
                  Post
                </button>
              </div>
            </div>
          </form>

          {/* Comments */}
          {postComments?.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-white/60 text-sm">
              No comments yet
            </div>
          ) : (
            <div className="space-y-4">
              {postComments?.map((comment) => {
                return (
                  <div
                    key={comment._id}
                    className="flex gap-3 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
                  >
                    {/* Profile Picture */}
                    <div className="w-10 h-10 shrink-0">
                      {comment.user.profilePic?.url ? (
                        <img
                          src={comment.user.profilePic.url}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                          {comment.user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm md:text-base">
                          @{comment.user.username}
                        </span>

                        <span className="text-xs text-gray-300">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-sm md:text-base text-white/90 leading-relaxed text-wrap break-all">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
