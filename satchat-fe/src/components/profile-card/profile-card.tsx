import React from "react";
import { Box, Typography, Avatar, Stack, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IMGAES_URL } from "@/global-config";

export const ProfileCard = ({
  name = "John Doe",
  email = "john.doe@example.com",
  friends = 245,
  followers = 1024,
  posts = 48,
  avatar = "/img/avatar_default.jpg",
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        bgcolor: "var(--background-component)",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
          }}
          alt={"Avatar of " + name}
          src={avatar ? IMGAES_URL + avatar : "/img/avatar_default.jpg"}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
          <Typography variant="body2" color="var(--foreground)">
            {email}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 1, bgcolor: "var(--foreground)" }} />

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          px: 1,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            {posts}
          </Typography>
          <Typography variant="body2" color="var(--foreground)">
            {t("profileCard.Posts")}
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            {friends}
          </Typography>
          <Typography variant="body2" color="var(--foreground)">
            {t("profileCard.Friends")}
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            {followers}
          </Typography>
          <Typography variant="body2" color="var(--foreground)">
            {t("profileCard.Followers")}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
