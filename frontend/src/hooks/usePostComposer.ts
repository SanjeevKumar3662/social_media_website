import { useState } from "react";
import { userPostStore } from "../store/postStore";

export const usePostComposer = () => {
  const { createPost } = userPostStore();

  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text && !image && !video) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      setIsSubmitting(true);
      await createPost(formData);

      setText("");
      setImage(null);
      setVideo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    text,
    image,
    video,
    setText,
    setImage,
    setVideo,
    handleSubmit,
    isSubmitting,
  };
};
