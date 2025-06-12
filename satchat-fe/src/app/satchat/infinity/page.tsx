"use client";

import React, { useState, useRef, useEffect } from "react";
import { relativeTime } from "@/utils/relative-time";
import { getPosts } from "@/_mock/_posts";
import { useTranslation } from "react-i18next";

// Post Card Component
const PostCard = React.forwardRef<HTMLDivElement, { post: Post }>(
  ({ post }, ref) => {
    // Format the relative time (e.g., "2 days ago")
    const timeAgo = relativeTime(new Date(post.createdAt));

    return (
      <div ref={ref} className="bg-white rounded-lg shadow-md p-4 my-4">
        {/* Author info */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold">
              {post.author.firstName} {post.author.lastName}
            </div>
            <div className="text-gray-500 text-sm">
              @{post.author.username} · {timeAgo}
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="mb-3">
          <p className="text-gray-800">{post.content}</p>
        </div>

        {/* Post image if available */}
        {post.images && (
          <div className="mb-3 rounded-lg overflow-hidden">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-auto rounded-lg mb-2"
              />
            ))}
          </div>
        )}

        {/* Topic tag */}
        <div className="mb-3">
          <span
            className="inline-block text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: post.topic.color || "#000000",
              color: "#ffffff",
            }}
          >
            {post.topic.name}
          </span>
        </div>

        {/* Interaction stats */}
        <div className="flex text-gray-500 text-sm">
          <div className="flex items-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {post.commentCount} comments
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 mr-1 ${
                post.hasLiked ? "text-red-500 fill-current" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {post.likedCount} likes
          </div>
        </div>
      </div>
    );
  }
);

PostCard.displayName = "PostCard";

// Main component
export default function Infinity() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const loadPosts = (pageNum: number): void => {
    setLoading(true);
    getPosts(pageNum)
      .then((response) => {
        const newPosts = response.data.data;
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(pageNum < response.data.totalPages);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Setup intersection observer
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>

      {posts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">No posts available</div>
      )}

      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <PostCard ref={lastPostElementRef} key={post.id} post={post} />
          );
        } else {
          return <PostCard key={post.id} post={post} />;
        }
      })}

      {loading && (
        <div className="text-center py-4">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          {t("posts.noMore")}
        </div>
      )}
    </div>
  );
}
