"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MainLayout } from "@/layouts";
import { getPageTitle } from "@/utils/pathNameUtils";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { ToggleGroup } from "@/components/toggle-group";
import { useEffect, useState } from "react";
import { FriendCard } from "@/sections/friends";
import { FriendRequest } from "@/sections/friends/view/friend-request";
import { useDispatch, useSelector } from "react-redux";
import { profileStore } from "@/store/reducers";
import { FriendSuggested } from "@/sections/friends/view/friend-suggested";
import { useTranslation } from "react-i18next";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: "10px",
  backgroundColor: "var(--background)",
  borderRadius: "50%",
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "var(--button-hover)",
  },
}));

const StyledArrowBackIcon = styled(ArrowBackIcon)({
  width: "24px",
  height: "24px",
  transition: "stroke 0.2s ease-in-out",
});

const FriendPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("all");
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const friends = useSelector(profileStore.selectFriends);
  const friendRequests = useSelector(profileStore.selectFriendRequests);
  const suggestedFriends = useSelector(profileStore.selectSuggestedFriends);
  const friendsPagination = useSelector(profileStore.selectPaginationFriends);
  const friendRequestsPagination = useSelector(
    profileStore.selectPaginationFriendRequests
  );
  const suggestedFriendsPagination = useSelector(
    profileStore.selectPaginationSuggestedFriends
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const TABITEMS = [
    { key: "all", label: t("friends.AddFriend") },
    { key: "requests", label: t("friends.FriendRequest") },
    { key: "suggested", label: t("friends.SuggestedFriends") },
  ];

  useEffect(() => {
    if (!currentUser?.id) return;
    const timeout = setTimeout(() => {
      if (activeTab === "all") {
        dispatch(
          profileStore.getFriends(
            currentUser?.id,
            friendsPagination.currentPage || 1
          )
        );
      } else if (activeTab === "requests") {
        dispatch(
          profileStore.getFriendRequests(
            currentUser?.id,
            friendRequestsPagination.currentPage || 1
          )
        );
      } else if (activeTab === "suggested") {
        // dispatch(profileStore.getSuggestedFriends(currentUser?.id, 1));
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [activeTab, dispatch, currentUser?.id]);

  const handleLoadMore = async () => {
    if (!currentUser?.id) return;

    setIsLoadingMore(true);
    try {
      if (activeTab === "all" && friendsPagination?.hasMore) {
        const nextPage = friendsPagination.currentPage + 1;
        await dispatch(profileStore.getFriends(currentUser.id, nextPage));
      } else if (
        activeTab === "requests" &&
        friendRequestsPagination?.hasMore
      ) {
        const nextPage = friendRequestsPagination.currentPage + 1;
        await dispatch(
          profileStore.getFriendRequests(currentUser.id, nextPage)
        );
      } else if (
        activeTab === "suggested" &&
        suggestedFriendsPagination?.hasMore
      ) {
        const nextPage = suggestedFriendsPagination.currentPage + 1;
        // await dispatch(profileStore.getSuggestedFriends(currentUser.id, nextPage));
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{getPageTitle(pathname)} | satchat</title>
      </Helmet>
      <Box sx={{ p: 2 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Toolbar className="flex justify-between items-center !p-0">
            <StyledIconButton onClick={() => router.back()}>
              <StyledArrowBackIcon />
            </StyledIconButton>
            <Typography
              variant="h6"
              className="text-white"
              style={{ color: "var(--foreground)", fontWeight: 600 }}
            >
              {t("friends.Friends")}
            </Typography>
            <Typography
              className="p-2.5 text-base cursor-pointer hover:text-primary"
              style={{ color: "var(--foreground)" }}
            >
              <></>
            </Typography>
          </Toolbar>
        </AppBar>
        <ToggleGroup
          className="w-full p-2 flex justify-between items-center bg-neutral3-60 rounded-[6.25rem]"
          items={TABITEMS}
          onChange={handleTabChange}
        />
        {activeTab === "all" && (
          <>
            {friends.map((friend: any) => {
              return (
                <Box
                  onClick={() => router.push(`/profile/${friend.id}`)}
                  className="cursor-pointer"
                >
                  <FriendCard key={friend.id} user={friend} />
                </Box>
              );
            })}
            {friendsPagination?.hasMore && (
              <button
                className="w-full p-2.5 mt-4 text-base cursor-pointer hover:text-primary bg-neutral3-60 rounded-lg flex justify-center items-center"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? t("friends.loading") : t("friends.loadMore")}
              </button>
            )}
          </>
        )}
        {activeTab === "requests" && (
          <>
            {friendRequests.map((friend: any) => {
              return (
                <Box
                  onClick={() => router.push(`/profile/${friend.id}`)}
                  className="cursor-pointer"
                >
                  <FriendRequest key={friend.id} user={friend} />
                </Box>
              );
            })}
            {friendRequestsPagination?.hasMore && (
              <button
                className="w-full p-2.5 mt-4 text-base cursor-pointer hover:text-primary bg-neutral3-60 rounded-lg flex justify-center items-center"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? t("friends.loading") : t("friends.loadMore")}
              </button>
            )}
          </>
        )}
        {activeTab === "suggested" && (
          <>
            {suggestedFriends.map((friend: any) => {
              return (
                <Box
                  onClick={() => router.push(`/profile/${friend.id}`)}
                  className="cursor-pointer"
                >
                  <FriendSuggested key={friend.id} user={friend} />
                </Box>
              );
            })}
            {suggestedFriendsPagination?.hasMore && (
              <button
                className="w-full p-2.5 mt-4 text-base cursor-pointer hover:text-primary bg-neutral3-60 rounded-lg flex justify-center items-center"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? t("friends.loading") : t("friends.loadMore")}
              </button>
            )}
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default FriendPage;
