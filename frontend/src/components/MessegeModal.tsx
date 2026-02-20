import { useEffect, type Dispatch, type SetStateAction } from "react";
import { userPostStore } from "../store/postStore";
import { formatDistanceToNow } from "date-fns";

type PropType = {
  postId: string;
  setShowMessegeModal: Dispatch<SetStateAction<boolean>>;
};

export const MessegeModal = ({ postId, setShowMessegeModal }: PropType) => {
  const { postComments, getPostComments } = userPostStore();

  useEffect(() => {
    (async () => {
      await getPostComments(postId);
    })();
  }, [getPostComments, postId]);

  console.log("postComments", postComments);

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
                      <p className="text-sm md:text-base text-white/90 leading-relaxed">
                        {comment.comment}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-4 mt-2 text-xs text-white/70">
                        <button className="hover:text-white transition">
                          Like
                        </button>
                        <button className="hover:text-white transition">
                          Reply
                        </button>
                      </div>
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
