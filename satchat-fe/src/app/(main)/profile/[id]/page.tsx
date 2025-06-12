"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MainLayout } from "@/layouts";
import { ProfileView } from "@/sections/profile";
import { getPageTitle } from "@/utils/pathNameUtils";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { useEffect, useState } from "react";
import backendClient from "@/utils/BackendClient";
import { useDispatch } from "react-redux";
import { commonStore, profileStore } from "@/store/reducers";
import { PostDialog } from "@/components/post-dialog";

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

export default function ProfileDetail() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await backendClient.getUserById(id);
        setUser(response.data.data);
      } catch (err) {
        dispatch(commonStore.actions.setErrorMessage("Failed to fetch user"));
      }
    };

    fetchUser();
  }, [id, dispatch]);

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
            {/* Leading (Back Button) */}
            <StyledIconButton onClick={() => router.back()}>
              <StyledArrowBackIcon />
            </StyledIconButton>

            {/* Title */}
            <Typography
              variant="h6"
              className="text-white"
              style={{ color: "var(--foreground)", fontWeight: 600 }}
            >
              Profile
            </Typography>

            {/* Trailing (Read All Button) */}
            <Typography
              onClick={() => {}}
              className="p-2.5 text-base cursor-pointer hover:text-primary"
              style={{ color: "var(--foreground)" }}
            >
              Filter
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Profile Bar */}
        <ProfileView user={user} />
      </Box>
      <PostDialog />
    </MainLayout>
  );
}
