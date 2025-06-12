"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MainLayout } from "@/layouts";
import { getPageTitle } from "@/utils/pathNameUtils";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useState } from "react";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import { BookmarkCard } from "@/components/bookmark-card";
import { savedPosts } from "@/_mock/_posts";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { bookmarkStore, profileStore } from "@/store/reducers";
import { IMGAES_URL } from "@/global-config";
import { useTranslation } from "react-i18next";

const filterOptions = [
  { label: "All", icon: <ArticleIcon /> },
  { label: "Text", icon: <TextFieldsIcon /> },
  { label: "Video", icon: <VideoLibraryIcon /> },
];

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

const BookMarkPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [item, setItem] = useState("All");
  const [open, setOpen] = useState(false);
  const bookmarks = useSelector(bookmarkStore?.selectBookmark) || [];
  const [page, setPage] = useState(1);
  const hasMore = useSelector(bookmarkStore.selectHasMore);
  const currentUser = useSelector(profileStore.selectCurrentUser);

  const choiceItems = (item: string) => {
    setOpen(false);
    setItem(item);
  };

  useEffect(() => {
    dispatch(bookmarkStore.getBookmark(page));
  }, [dispatch, currentUser?.id, page]);

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
              {t("bookmarks.Bookmarks")}
            </Typography>
            <Button
              variant="contained"
              sx={{
                color: "var(--foreground)",
                backgroundColor: "var(--background)",
                borderRadius: "50%",
                minWidth: "40px",
                p: 1,
              }}
              onClick={() => setOpen((prev) => !prev)}
            >
              <FilterListIcon />
            </Button>
            {open && (
              <div
                className="absolute top-15 right-0 z-10 p-4 rounded-lg shadow-lg w-48"
                style={{ backgroundColor: "var(--background)" }}
              >
                {filterOptions.map(({ label, icon }, index) => (
                  <Button
                    key={index}
                    sx={{
                      color: "var(--foreground)",
                      width: "100%",
                      justifyContent: "flex-start",
                      mb: index !== 2 ? 1 : 0,
                      "&:hover": { backgroundColor: "var(--button-hover)" },
                    }}
                    startIcon={icon}
                    onClick={() => choiceItems(label)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Grid container spacing={2} justifyContent="left" sx={{ mt: 2 }}>
          {bookmarks.map((post: any, index: any) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <BookmarkCard
                postId={post.id}
                createdAt={post.createdAt}
                content={post.content}
                likedCount={post.likedCount}
                commentCount={post.commentCount}
                type={post.type}
                avatar={IMGAES_URL + post.author.avatar}
                name={post.topic.name}
                color={post.topic.color}
                authorId={currentUser?.id}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
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
          {t("bookmarks.loadMore")}
        </Button>
      )}
    </MainLayout>
  );
};

export default BookMarkPage;
