import { Avatar, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ICONS = {
  LIKE_POST: <FavoriteIcon sx={{ color: "red", fontSize: 14 }} />,
  COMMENT_POST: <ChatBubbleIcon sx={{ color: "blue", fontSize: 14 }} />,
  COMMENT_LIKED: <FavoriteIcon sx={{ color: "red", fontSize: 14 }} />,
  FOLLOW_USER: <PersonAddIcon sx={{ color: "green", fontSize: 14 }} />,
  FRIEND_REQUEST: <PersonAddIcon sx={{ color: "green", fontSize: 14 }} />,
  FRIEND_REQUEST_ACCEPTED: (
    <CheckCircleIcon sx={{ color: "green", fontSize: 14 }} />
  ),
};

export const NotificationAvatar: React.FC<{
  avatarUrl: string;
  messageType: keyof typeof ICONS;
}> = ({ avatarUrl, messageType }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Avatar src={avatarUrl} sx={{ width: 40, height: 40 }} />
      <Box
        sx={{
          position: "absolute",
          bottom: -3,
          right: -3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 1,
        }}
      >
        {ICONS[messageType]}
      </Box>
    </Box>
  );
};
