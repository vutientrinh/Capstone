"use client";

import { ProfileTag } from "@/components/profile-tag";
import { ToggleGroup } from "@/components/toggle-group";
import { TrendingPostCard } from "@/components/trending-post-card";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IMGAES_URL } from "@/global-config";
import { useDispatch, useSelector } from "react-redux";
import { profileStore, trendingStore } from "@/store/reducers";
import { useTranslation } from "react-i18next";

export const SideBarRight = () => {
  const pathName = usePathname();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // 1: Follows, 2: Trending posts
  const [activeTab, setActiveTab] = useState("1");
  // Loading state for posts and followers
  const [isLoading, setIsLoading] = useState({
    posts: true,
    followers: true,
  });
  const trendingPosts = useSelector(trendingStore.selectPosts);
  const users = useSelector(profileStore.selectSuggestedFriends);
  const filter = useSelector(trendingStore.selectFilter);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    dispatch(profileStore.getSuggestedFriends());
    if (activeTab !== "1") dispatch(trendingStore.getPostsTrending(1, filter));
  }, [dispatch, activeTab, filter]);

  return (
    <Box sx={{ p: 2 }} suppressHydrationWarning>
      <ToggleGroup
        className="w-full p-1 flex justify-between items-center bg-neutral3-60 rounded-[6.25rem]"
        items={[
          { key: "1", label: t("sideBarRight.Suggested") },
          { key: "2", label: t("sideBarRight.Trending") },
        ]}
        onChange={handleTabChange}
      />
      <>
        {activeTab === "1" ? (
          <div className="flex flex-col gap-2 ">
            {/* max-h-[calc(100svh-68px)] overflow-y-scroll scrollbar-hide"> */}
            {users.map((follower: any) => (
              <ProfileTag
                key={follower.id}
                user={{
                  id: follower.id,
                  username: follower.username,
                  firstName: follower.firstName,
                  lastName: follower.lastName,
                  avatar: IMGAES_URL + follower.avatar,
                  isOnline: follower.isOnline,
                }}
                hasFollowedBack={follower.hasFollowedBack}
                onFollow={() => {
                  console.log("Followed");
                }}
              />
            ))}
          </div>
        ) : (
          <ul>
            {/* className="max-h-[calc(100svh-68px)] overflow-y-scroll scrollbar-hide"> */}
            {trendingPosts.map((post: any) => (
              <li key={post.id} className="mb-2">
                <TrendingPostCard
                  post={post}
                  topic={post.topic}
                  alt={post.id}
                  author={post.author}
                  image={
                    post.images.length > 0
                      ? IMGAES_URL + post.images[0]
                      : "/img/default_cover.jpg"
                  }
                  content={post.content}
                  time={post.createdAt}
                />
              </li>
            ))}
          </ul>
        )}
      </>
    </Box>
  );
};
