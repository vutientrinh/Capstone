"use client";

import { HomeView } from "@/sections/home";
import { FriendView } from "@/sections/messages/view/friend-view";
import { getPageTitle } from "@/utils/pathNameUtils";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Helmet } from "react-helmet-async";

export default function MessagesPage() {
  const pathname = usePathname();

  return (
    <HomeView>
      <Helmet>
        <title>{getPageTitle(pathname)} | satchat</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <FriendView />
      </Box>
    </HomeView>
  );
}
