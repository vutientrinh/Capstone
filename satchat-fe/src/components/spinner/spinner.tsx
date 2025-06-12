"use client";

import { commonStore } from "@/store/reducers";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const Spinner = ({ children }: { children: React.ReactNode }) => {
  const loading = useSelector(commonStore.selectIsLoading);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "var(--foreground)" }} />
      </Box>
    );
  }

  return <>{children}</>;
};
export default Spinner;
