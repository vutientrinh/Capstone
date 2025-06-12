"use client";

import React, { useState } from "react";
import { Heart, MessageSquare, Bookmark, BookmarkX } from "lucide-react";
import { relativeTime } from "@/utils/relative-time";
import { truncateText } from "@/utils/stringUtils";
import "./styles.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { bookmarkStore, postStore } from "@/store/reducers";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface BookmarkCardProps {
  postId: string;
  createdAt: string;
  content: string;
  likedCount: number;
  commentCount: number;
  type: string;
  avatar: string; //actor
  name: string; //topicName
  color: string;
  authorId?: string;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  postId = "1",
  createdAt = new Date().toISOString(),
  content = "Sample Content",
  likedCount = 0,
  commentCount = 0,
  type = "TEXT",
  avatar = "/img/avatar_default.jpg",
  name = "Sample Name",
  color = "var(--foreground)",
  authorId = "1",
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleToggle = () => {
    dispatch(postStore.unSavePost(authorId, postId));
    dispatch(bookmarkStore.actions.removeBookmark(postId));
  };
  const handleClick = () => {
    dispatch(postStore.actions.setCurrentPostId(postId));
  };
  return (
    <article className="w-full min-w-64 max-w-sm bg-card rounded-xl shadow-md overflow-hidden">
      {/* Card Header with Gradient */}
      <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100">
            {avatar && (
              <Image
                width={48}
                height={48}
                src={avatar}
                alt={`${name}'s avatar`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <div className="p-4 pt-8 flex flex-col h-64">
        <Link href={`/post/${postId}`} className="w-full" onClick={handleClick}>
          <div className="mb-3">
            <div className="text-lg font-semibold text-foreground flex items-center">
              <span className="text-xl" style={{ color }}>
                •
              </span>
              <span className="ml-2">{name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {relativeTime(new Date(createdAt))}
            </div>
          </div>
          <div className="text-foreground font-medium mb-4 flex-grow overflow-hidden">
            <p className="break-words">{truncateText(content)}</p>
          </div>
        </Link>
        <div className="flex flex-wrap gap-3 pt-3 border-t border-border mt-auto">
          <div className="flex items-center gap-1">
            <Heart size={18} className="text-red-500" fill="currentColor" />
            <span className="text-sm text-foreground">{likedCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={18} className="text-blue-500" />
            <span className="text-sm text-foreground">{commentCount}</span>
          </div>
          <button
            onClick={handleToggle}
            className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
            aria-label="Remove bookmark"
          >
            <BookmarkX size={18} className="text-purple-600" />
            <span>{t("bookmarks.rmvBookmark")}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
