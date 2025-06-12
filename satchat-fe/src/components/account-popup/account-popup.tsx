"use client";

import {
  alpha,
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { profileStore } from "@/store/reducers";
import { useRouter } from "next/navigation";
import { IMGAES_URL } from "@/global-config";
import { useTranslation } from "react-i18next";

const AccountPopup = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoading, isAuthenticated, logout } = useAuth();
  const userProfile = useSelector(profileStore.selectCurrentUser);
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const MENU_OPTIONS = [
    {
      label: t("navbar.Home"),
      icon: "eva:home-fill",
      href: "/",
    },
    {
      label: t("navbar.Profile"),
      icon: "eva:person-fill",
      href: "/profile",
    },
    {
      label: t("navbar.Settings"),
      icon: "eva:settings-2-fill",
      href: "/settings",
    },
  ];

  useEffect(() => {
    dispatch(profileStore.getCurrentUser());
  }, [dispatch]);

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar
          src={
            userProfile?.avatar
              ? IMGAES_URL + userProfile?.avatar
              : "/img/avatar_default.jpg"
          }
          alt="User Avatar"
        />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userProfile?.firstName} {userProfile?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            @{userProfile?.username}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => {
                setOpen(null);
                router.push(option.href);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          {t("navbar.Logout")}
        </MenuItem>
      </Popover>
    </>
  );
};
export default AccountPopup;
