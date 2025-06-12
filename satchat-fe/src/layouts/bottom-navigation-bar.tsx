import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export const BottomNavigationBar = () => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const NAVIGATION_ITEMS = [
    {
      title: t("sideBarLeft.Friends"),
      icon: "🧑‍🤝‍🧑",
      href: "/friends",
    },
    {
      title: t("sideBarLeft.Notifications"),
      icon: "🔔",
      href: "/notifications",
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

  const handleNavigation = (href: any) => {
    router.push(href);
  };

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        width: "auto",
        maxWidth: "90%",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "100px",
          backgroundColor: "rgba(34, 34, 34, 0.9)",
          backdropFilter: "blur(10px)",
          padding: "8px 16px",
        }}
      >
        {NAVIGATION_ITEMS.map((item) => (
          <IconButton
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            sx={{
              mx: 0.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              padding: "8px",
              borderRadius: "50%",
              fontSize: "18px",
              transition: "all 0.2s ease-in-out",
            }}
            aria-label={item.icon}
          >
            <span>{item.icon}</span>
          </IconButton>
        ))}
      </Paper>
    </Box>
  );
};
