"use client";

import { ArrowBackIcon } from "@/components/icons";
import { PostDialog } from "@/components/post-dialog";
import { MainLayout } from "@/layouts";
import { ProfileView } from "@/sections/profile";
import { profileStore } from "@/store/reducers";
import { getPageTitle } from "@/utils/pathNameUtils";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

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

export default function EditProfile() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const currentUser = useSelector(profileStore.selectCurrentUser);

  useEffect(() => {
    dispatch(profileStore.getCurrentUser());
  }, [dispatch]);

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
              Profile
            </Typography>
            <Typography
              onClick={() => {}}
              className="p-2.5 text-base cursor-pointer hover:text-primary"
              style={{ color: "var(--foreground)" }}
            >
              <></>
            </Typography>
          </Toolbar>
        </AppBar>
        <ProfileView user={currentUser} />
      </Box>
      <PostDialog />
    </MainLayout>
  );
}
