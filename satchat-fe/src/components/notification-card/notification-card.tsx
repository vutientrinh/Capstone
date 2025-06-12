import React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { relativeTime } from "@/utils/relative-time";
import { NotificationAvatar } from "./notification-avatar";

interface NotificationProps {
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  avatarUrl?: string;
}

const NOTIFICATION_TYPES = {
  LIKE_POST: "LIKE_POST",
  COMMENT_POST: "COMMENT_POST",
  COMMENT_LIKED: "COMMENT_LIKED",
  FOLLOW_USER: "FOLLOW_USER",
  FRIEND_REQUEST: "FRIEND_REQUEST",
  FRIEND_REQUEST_ACCEPTED: "FRIEND_REQUEST_ACCEPTED",
};

export const NotificationCard: React.FC<NotificationProps> = ({
  content,
  messageType,
  isRead,
  createdAt,
  avatarUrl,
}) => {
  return (
    <Paper
      elevation={isRead ? 1 : 3}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 3,
        m: 2,
        borderRadius: "12px",
        backgroundColor: "var(--background-component)",
        cursor: "pointer",
        position: "relative",
        "&:hover": {
          backgroundColor: "var(--button-hover)",
        },
      }}
    >
      <NotificationAvatar
        avatarUrl={avatarUrl || "/img/avatar_default.jpg"}
        messageType={
          (messageType as keyof typeof NOTIFICATION_TYPES) || "LIKE_POST"
        }
      />
      <Box flex={1}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", color: "var(--foreground)" }}
        >
          {content}
        </Typography>
        <Typography variant="body2" color="var(--foreground)">
          {relativeTime(new Date(createdAt))}
        </Typography>
      </Box>

      {!isRead && (
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: "#2bc6ff",
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      )}
    </Paper>
  );
};
