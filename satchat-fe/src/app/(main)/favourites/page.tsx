"use client";

import { ArrowBackIcon } from "@/components/icons";
import { MainLayout } from "@/layouts";
import { ProductCard, ProductDetail } from "@/sections/marketplace";
import { likedProductStore, productStore } from "@/store/reducers";
import { getPageTitle } from "@/utils/pathNameUtils";
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
import { useTranslation } from "react-i18next";
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

const FavouritesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { t } = useTranslation();
  const likedProducts = useSelector(likedProductStore.selectLikedProducts);
  const [page, setPage] = useState(1);
  const hasMore = useSelector(likedProductStore.selectHasMore);
  const display = useSelector(productStore.selectShowQuickView);

  useEffect(() => {
    dispatch(likedProductStore.getLikedProducts(page));
  }, [dispatch, page]);

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
              <StyledArrowBackIcon color="var(--foreground)" />
            </StyledIconButton>
            <Typography
              variant="h6"
              className="text-white"
              style={{ color: "var(--foreground)", fontWeight: 600 }}
            >
              {t("tracking.favourites")}
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
        {likedProducts && likedProducts.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {likedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full p-4 text-gray-500">
            {t("marketplace.noAvailable")}
          </div>
        )}
        {hasMore && (
          <Button
            variant="outlined"
            onClick={() => {
              setPage((prevPage) => prevPage + 1);
            }}
            sx={{
              margin: "20px auto",
              display: "block",
              backgroundColor: "var(--button-hover)",
              color: "var(--foreground)",
              "&:hover": {
                backgroundColor: "var(--button-hover)",
              },
            }}
          >
            {t("marketplace.loadMore")}
          </Button>
        )}
      </Box>
      <ProductDetail display={display} />
    </MainLayout>
  );
};

export default FavouritesPage;
