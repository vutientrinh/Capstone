"use client";

import { AddressDialog } from "@/components/address-popup";
import { ArrowBackIcon, CloseIcon } from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { MainLayout } from "@/layouts";
import { FilterBar, ProductCard, ProductDetail } from "@/sections/marketplace";
import { addressStore, productStore } from "@/store/reducers";
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

export default function MarketplacePage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const products = useSelector(productStore.selectProducts);
  const productFilter = useSelector(productStore.selectFilter);
  const [page, setPage] = useState(1);
  const hasMore = useSelector(productStore.selectHasMore);

  // product detail
  const display = useSelector(productStore.selectShowQuickView);
  const addressDisplay = useSelector(addressStore.selectIsOpen);

  useEffect(() => {
    loadPosts(page);
  }, [isAuthenticated, page, productFilter]);

  useEffect(() => {
    setPage(1);
  }, [productFilter]);

  const loadPosts = (pageNum: number): void => {
    const isDefaultFilter = isDefaultFilterAndSort(productFilter);
    setTimeout(() => {
      dispatch(
        productStore.getProducts(pageNum, productFilter, isDefaultFilter)
      );
    }, 0);
  };

  const isDefaultFilterAndSort = (filterObj: any) => {
    const defaultFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: null,
      inStock: false,
    };

    const defaultSort = {
      field: "createdAt",
      direction: "desc",
    };

    const { filters, sort } = filterObj || {};

    return (
      filters &&
      sort &&
      filters.search === defaultFilters.search &&
      filters.category === defaultFilters.category &&
      filters.minPrice === defaultFilters.minPrice &&
      filters.maxPrice === defaultFilters.maxPrice &&
      (filters.rating === defaultFilters.rating ||
        filters.rating === undefined) &&
      filters.inStock === defaultFilters.inStock &&
      sort.field === defaultSort.field &&
      sort.direction === defaultSort.direction
    );
  };

  console.log("MarketplacePage products", products);
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
              {t("marketplace.Marketplace")}
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
        <FilterBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 4,
          }}
        >
          {products && products.length > 0 ? (
            products
              .filter((product: any) => product.stockQuantity > 0)
              .map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
          ) : (
            <div className="flex justify-center items-center w-full h-full p-4 text-gray-500">
              {t("marketplace.noAvailable")}
            </div>
          )}
        </Box>
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
            Load More
          </Button>
        )}
      </Box>

      <ProductDetail display={display} />
      <AddressDialog isDialogOpen={addressDisplay} />
    </MainLayout>
  );
}
