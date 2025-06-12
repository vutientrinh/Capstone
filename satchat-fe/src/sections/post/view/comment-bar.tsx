"use client";

import { useAuth } from "@/context/auth-context";
import { IMGAES_URL } from "@/global-config";
import { postStore, profileStore } from "@/store/reducers";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

interface CommentBarProps {
  post: Post;
}

export const CommentBar: React.FC<CommentBarProps> = ({ post }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userProfile = useSelector(profileStore.selectCurrentUser);
  const { isAuthenticated, isLoading } = useAuth();
  const [comment, setComment] = useState("");

  const fetchUserProfile = async () => {
    dispatch(profileStore.getCurrentUser());
  };

  const handleComment = async () => {
    dispatch(postStore.addComment(post.id, comment.trim()));
    setComment("");
  };

  useEffect(() => {
    //fetchUserProfile();
  }, [isAuthenticated, isLoading]);

  return (
    <div className="flex gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-600">
        <img
          src={
            userProfile.avatar
              ? IMGAES_URL + userProfile.avatar
              : "/img/avatar_default.jpg"
          }
          alt={`Avatar`}
          className="w-10 h-10 rounded-full bg-gray-600 object-cover"
        />
      </div>
      <div
        className="flex-1 flex items-center rounded-full px-4"
        style={{ backgroundColor: "var(--comment-bar)" }}
      >
        <input
          type="text"
          placeholder={t("posts.AddComment")}
          className="flex-1 bg-transparent border-none text-white py-2 outline-none"
          style={{ color: "var(--foreground)" }}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        {/* Send comment */}
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none text-gray-400 text-lg cursor-pointer">
            📷
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center bg-transparent border-none text-gray-400 cursor-pointer"
            onClick={handleComment}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
