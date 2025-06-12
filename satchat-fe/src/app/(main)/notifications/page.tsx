"use client";

// import { ArrowBackIcon } from "@/components/icons";
import { ToggleGroup } from "@/components/toggle-group";
import { MainLayout } from "@/layouts";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styled from "styled-components";
import { getPageTitle } from "@/utils/pathNameUtils";
import { NotificationCard } from "@/components/notification-card/notification-card";
import { useDispatch, useSelector } from "react-redux";
import { notificationStore, profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { IMGAES_URL, SOCKET_URL } from "@/global-config";
import { useTranslation } from "react-i18next";
import socketClient from "@/socket/SocketClient";
import { endpoints } from "@/utils/endpoints";
import { getCookie } from "cookies-next";

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

export default function NotificationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const _notifications = useSelector(notificationStore.selectNotifications);
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const hasMore = useSelector(notificationStore.selectHasMore);
  const filter = useSelector(notificationStore.selectFilter);

  const TABITEMS = [
    { key: "all", label: t("notifications.All") },
    { key: "likes", label: t("notifications.Likes") },
    { key: "requests", label: t("notifications.Requests") },
    { key: "follows", label: t("notifications.Follows") },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
    switch (key) {
      case "all":
        dispatch(notificationStore.actions.resetFilter());
        break;
      case "likes":
        dispatch(
          notificationStore.actions.setFilter({ messageType: "LIKE_POST" })
        );
        break;
      case "requests":
        dispatch(
          notificationStore.actions.setFilter({ messageType: "FRIEND_REQUEST" })
        );
        break;
      case "follows":
        dispatch(
          notificationStore.actions.setFilter({ messageType: "FOLLOW_USER" })
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(notificationStore.getNotifications(page, filter));
  }, [dispatch, page, filter]);

  const handleReadAll = async () => {
    await backendClient.readAllNotifications();
    dispatch(notificationStore.actions.readAllNotifications());
  };

  useEffect(() => {
    return () => {
      dispatch(notificationStore.actions.resetFilter());
      setPage(1);
    };
  }, [dispatch]);

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
            dispatch(notificationStore.actions.appendNotification(messageBody));
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
              Notifications
            </Typography>
            <Button
              onClick={handleReadAll}
              className="p-2.5 text-base cursor-pointer hover:text-primary"
              style={{ color: "var(--foreground)", textTransform: "none" }}
            >
              <Typography variant="body1">
                {t("notifications.readAll")}
              </Typography>
            </Button>
          </Toolbar>
        </AppBar>
        <ToggleGroup
          className="w-full p-2 flex justify-between items-center bg-neutral3-60 rounded-[6.25rem]"
          items={TABITEMS}
          onChange={handleTabChange}
        />
        {_notifications &&
          _notifications.map((notification: any) => (
            <NotificationCard
              key={notification.id}
              content={notification.content}
              messageType={notification.messageType}
              isRead={notification.isRead}
              createdAt={notification.createdAt}
              avatarUrl={IMGAES_URL + notification.actor.avatar}
            />
          ))}
        {hasMore && (
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => prev + 1)}
            sx={{
              display: "block",
              margin: "0 auto",
              mt: 2,
              mb: 4,
              color: "var(--foreground)",
              borderColor: "var(--foreground)",
              "&:hover": {
                backgroundColor: "var(--button-hover)",
                borderColor: "var(--button-hover)",
              },
            }}
          >
            {t("notifications.loadMore")}
          </Button>
        )}
        {_notifications.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4, color: "gray.500" }}>
            {t("notifications.noMore")}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}
