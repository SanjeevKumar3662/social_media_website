import React, { useEffect, useState } from "react";
import { X, LoaderPinwheel } from "lucide-react";
import { useAuthStore } from "../store/authStore";

type Props = {
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpdateProfileModal = ({ setShowEditModal }: Props) => {
  const { authUser, updateUserProfile } = useAuthStore();

  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  Pre-fill from authUser (single source of truth)
  useEffect(() => {
    if (authUser) {
      setFullname(authUser.fullname || "");
      setBio(authUser.bio || "");
      setPreviewProfile(authUser.profilePic?.url || null);
      setPreviewCover(authUser.coverPic?.url || null);
    }
  }, [authUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("bio", bio);

    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);

    try {
      setIsSubmitting(true);
      await updateUserProfile(formData);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[85dvh] bg-[#1f3c6d] text-white rounded-2xl p-4 md:p-6 overflow-y-auto shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold">Update Profile</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {!isSubmitting ? (
            <form
              onSubmit={handleUpdateProfile}
              className="flex flex-col gap-4"
            >
              {/* Full Name */}
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-[#2a4d85] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              {/* Bio */}
              <textarea
                placeholder="Your bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full resize-none bg-[#2a4d85] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-24"
              />

              {/* Cover Preview */}
              {(coverPic || previewCover) && (
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
                  <img
                    src={
                      coverPic ? URL.createObjectURL(coverPic) : previewCover!
                    }
                    className="w-full max-h-60 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverPic(null);
                      setPreviewCover(null);
                    }}
                    className="absolute top-2 right-2 bg-black/60 p-1 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Profile Preview */}
              {(profilePic || previewProfile) && (
                <div className="relative w-32 h-32">
                  <img
                    src={
                      profilePic
                        ? URL.createObjectURL(profilePic)
                        : previewProfile!
                    }
                    className="w-full h-full rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePic(null);
                      setPreviewProfile(null);
                    }}
                    className="absolute top-0 right-0 bg-black/60 p-1 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Upload Buttons */}
              <div className="flex gap-4">
                <label className="cursor-pointer text-black bg-amber-50 hover:text-blue-400 transition  py-1 px-2 rounded-xl">
                  Profile Pic
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      e.target.files?.[0] && setProfilePic(e.target.files[0])
                    }
                  />
                </label>

                <label className="cursor-pointer bg-amber-50 text-black hover:text-green-400 transition py-1 px-2 rounded-xl">
                  Cover Pic
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      e.target.files?.[0] && setCoverPic(e.target.files[0])
                    }
                  />
                </label>
              </div>

              {/* Submit */}
              <div className="flex justify-end border-t border-white/10 pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center flex justify-center gap-3">
              <span className="animate-bounce">Updating...</span>
              <LoaderPinwheel className="animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
