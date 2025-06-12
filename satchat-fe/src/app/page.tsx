"use client";

import { MainLayout } from "@/layouts/index";
import { PostCard, Posts } from "@/sections/post";
import { postStore } from "@/store/reducers";
import {
  AppBar,
  Box,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { PostDialog } from "@/components/post-dialog";
import { NewPost } from "@/components/new-post";
import { NewPostDialog } from "@/components/new-post-dialog";
import { AddressDialog } from "@/components/address-popup";
import { useTranslation } from "react-i18next";

export default function Home() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <>
      <MainLayout>
        <Helmet>
          <title>Homepage | satchat</title>
        </Helmet>
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5" component="h1" textAlign="center">
                👋 {t("mainPage.welcome")}{" "}
                <span
                  style={{
                    color: "#5661f7",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Connected
                </span>
              </Typography>
              <NewPost />
            </Box>
            <Posts />
          </Box>
        </Container>
        <PostDialog />
      </MainLayout>
    </>
  );
}
