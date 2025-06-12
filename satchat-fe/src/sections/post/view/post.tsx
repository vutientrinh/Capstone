"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles.css";
import { Box } from "@mui/material";
import PostCard from "./post-card";
import { useAuth } from "@/context/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { postStore } from "@/store/reducers";
import { useTranslation } from "react-i18next";

const Posts = ({
  user = null,
  postFilter = null,
}: {
  user?: any;
  postFilter?: any;
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const posts = useSelector(postStore.selectPosts);
  const loading = useSelector(postStore.selectLoading);
  const hasMore = useSelector(postStore.selectHasMore);
  const currentPage = useSelector(postStore.selectCurrentPage);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(postStore.actions.resetFilter());
  }, [postFilter, dispatch]);

  useEffect(() => {
    if (!hasMore) return;
    const timer = setTimeout(() => {
      loadPosts(currentPage);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, currentPage, postFilter, hasMore, user?.id]);

  const loadPosts = (pageNum: number): void => {
    if (isAuthenticated && hasMore && !loading) {
      if (postFilter) {
        dispatch(postStore.getPosts(pageNum, postFilter));
      } else {
        dispatch(postStore.getRecPosts(pageNum));
      }
    }
  };

  // Setup intersection observer
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setTimeout(() => {
          dispatch(postStore.actions.setCurrentPage(currentPage + 1));
        }, 500);
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
  }, [loading, hasMore, currentPage, dispatch]);

  return (
    <Box sx={{ maxWidth: "xl", mx: "auto", py: 2 }}>
      {posts.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8, color: "gray.500" }}>
          No posts available
        </Box>
      )}

      {posts.map((post: any, index: number) => {
        if (posts.length === index + 1) {
          if (post.postStatus === "APPROVED") {
            return (
              <PostCard ref={lastPostElementRef} key={post.id} post={post} />
            );
          }
        } else {
          if (post.postStatus === "APPROVED") {
            return <PostCard key={post.id} post={post} />;
          }
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
        <Box sx={{ textAlign: "center", py: 4, color: "gray.500" }}>
          {t("posts.noMore")}
        </Box>
      )}
    </Box>
  );
};
export default Posts;
