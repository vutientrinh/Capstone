"use client";

import { Box, Typography } from "@mui/material";
import "./styles.css";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { ProfileCard } from "@/components/profile-card";
import { useDispatch, useSelector } from "react-redux";
import { notificationStore, profileStore } from "@/store/reducers";
import { useAuth } from "@/context/auth-context";
import { title } from "process";
import { IMGAES_URL, SOCKET_URL } from "@/global-config";
import { useTranslation } from "react-i18next";
import socketClient from "@/socket/SocketClient";
import { endpoints } from "@/utils/endpoints";
import { getCookie } from "cookies-next";

export const SideBarLeft = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const userProfile = useSelector(profileStore.selectCurrentUser);
  const [selected, setSelected] = useState<string>("");
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState<number>(0);

  const ITEMS = [
    {
      title: t("sideBarLeft.Friends"),
      icon: "🧑‍🤝‍🧑",
      href: "/friends",
    },
    {
      title: t("sideBarLeft.Notifications"),
      icon: "🔔",
      href: "/notifications",
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
    },
    {
      title: t("sideBarLeft.Bookmarks"),
      icon: "🔖",
      href: "/bookmarks",
    },
    {
      title: t("sideBarLeft.Messages"),
      icon: "💭",
      href: "/messages",
    },
    {
      title: t("sideBarLeft.Marketplace"),
      icon: "🛍️",
      href: "/marketplace",
    },
    {
      title: t("sideBarLeft.Tracking"),
      icon: "📦",
      href: "/tracking",
    },
    {
      title: t("sideBarLeft.Favorites"),
      icon: "⭐",
      href: "/favourites",
    },
  ];

  const fetchUserProfile = async () => {
    dispatch(profileStore.getCurrentUser());
  };

  useEffect(() => {
    const storedCount = localStorage.getItem("notUnRead");
    if (storedCount) {
      setUnreadNotificationCount(Number(storedCount));
    }

    fetchUserProfile();
  }, [dispatch]);

  useEffect(() => {
    const handleRefresh = () => {
      const updatedCount = Number(localStorage.getItem("notUnRead") || "0");
      setUnreadNotificationCount(updatedCount);
    };

    window.addEventListener("refreshNotifications", handleRefresh);
    window.addEventListener("incrementNotifications", handleRefresh);

    return () => {
      window.removeEventListener("refreshNotifications", handleRefresh);
      window.removeEventListener("incrementNotifications", handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    socketClient.connect(
      SOCKET_URL + endpoints.webSocketUrl,
      getCookie("token") as string,
      [
        {
          topic: `/topic/notifications/${currentUser?.id}`,
          callback: (message: any) => {
            const messageBody = JSON.parse(message.body);
            setUnreadNotificationCount((prevCount) => prevCount + 1);
            localStorage.setItem(
              "notUnRead",
              (Number(localStorage.getItem("notUnRead")) + 1).toString()
            );
          },
          forMessageTypes: [
            "COMMENT_POST",
            "COMMENT_LIKED",
            "LIKE_POST",
            "FRIEND_REQUEST",
            "FOLLOW_USER",
            "FRIEND_REQUEST_ACCEPTED",
          ],
        },
      ]
    );
  }, [socketClient, currentUser?.id]);

  return (
    <>
      {userProfile && (
        <Box sx={{ p: 2 }}>
          <ProfileCard
            name={`${userProfile?.firstName} ${userProfile?.lastName}`}
            email={`@${userProfile.username}`}
            followers={userProfile.followerCount}
            friends={userProfile.friendsCount}
            posts={userProfile.postCount}
            avatar={userProfile.avatar}
          />
          <div className="left-sidebar">
            {ITEMS.map((item) => (
              <Link href={item.href} key={item.title}>
                <div
                  className={`menu-item ${
                    selected === item.title ? "active" : ""
                  } flex items-center gap-3 p-2 relative`}
                  onClick={() => setSelected(item.title)}
                >
                  <div className="post-avatar relative">
                    <h1 className="text-4xl m-0">{item.icon}</h1>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] px-1">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </div>
                  <Typography>{item.title}</Typography>
                </div>
              </Link>
            ))}
          </div>
        </Box>
      )}
    </>
  );
};
