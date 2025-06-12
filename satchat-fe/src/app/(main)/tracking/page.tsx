"use client";

import { ArrowBackIcon } from "@/components/icons";
import { ToggleGroup } from "@/components/toggle-group";
import { MainLayout } from "@/layouts";
import { TrackingCard } from "@/sections/tracking";
import { commonStore, orderStore, profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
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

export default function TrackingOrders() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("ALL");
  const orders = useSelector(orderStore.selectOrders);
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const [page, setPage] = useState(1);
  const hasMore = useSelector(orderStore.selectHasMore);
  const filter = useSelector(orderStore.selectFilter);

  const TABITEMS = [
    { key: "ALL", label: t("tracking.all") },
    { key: "PENDING", label: t("tracking.pending") },
    { key: "SHIPPED", label: t("tracking.shipped") },
    { key: "DELIVERED", label: t("tracking.delivered") },
    { key: "CANCELLED", label: t("tracking.cancelled") },
    { key: "FAILED", label: t("tracking.failed") },
  ];

  useEffect(() => {
    if (!currentUser) return;

    dispatch(
      orderStore.actions.setFilter({
        status: null,
        customerId: currentUser.id,
      })
    );
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (!filter || !currentUser) return;
    dispatch(orderStore.fetchOrders(page, filter));
  }, [filter, page, dispatch]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
    let status = null;
    let customerId = currentUser?.id;
    switch (key) {
      case "ALL":
        status = null;
        break;
      case "PENDING":
        status = "PENDING";
        break;
      case "SHIPPED":
        status = "SHIPPED";
        break;
      case "DELIVERED":
        status = "DELIVERED";
        break;
      case "CANCELLED":
        status = "CANCELLED";
        break;
      case "FAILED":
        status = "FAILED";
        break;
      default:
        break;
    }

    // set filter to store
    dispatch(orderStore.actions.setFilter({ status, customerId }));
  };

  const handleCancelOrder = async (orderId: any) => {
    try {
      const response: any = await backendClient.cancelOrder(orderId);
      console.log("Response:", response);
      if (response) {
        const result = response.data;
        dispatch(orderStore.actions.updateOrder(result));
        dispatch(
          commonStore.actions.setSuccessMessage(
            `Cập nhật trạng thái đơn hàng ${orderId} thành công!`
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      dispatch(
        commonStore.actions.setErrorMessage(
          "Lỗi hệ thống! Vui lòng thử lại sau."
        )
      );
    }
  };

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
              {t("tracking.tracking")}
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
        <ToggleGroup
          className="w-full p-2 flex justify-between items-center bg-neutral3-60 rounded-[6.25rem]"
          items={TABITEMS}
          onChange={(key: string) => {
            handleTabChange(key);
          }}
        />

        {orders.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {orders.map((order: any) => (
              <TrackingCard
                key={order.id}
                order={order}
                handleCancelOrder={handleCancelOrder}
                handleTabChange={handleTabChange}
              />
            ))}
          </div>
        )}
        {orders.length === 0 && (
          <Box
            sx={{ marginTop: "10rem" }}
            className="flex flex-col items-center"
          >
            <Typography
              variant="body1"
              className="text-center mt-4"
              style={{ color: "var(--foreground)" }}
            >
              No orders found.
            </Typography>
          </Box>
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
            Load More
          </Button>
        )}
      </Box>
    </MainLayout>
  );
}
