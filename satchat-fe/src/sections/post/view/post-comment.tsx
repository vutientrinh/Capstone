import { Heart } from "lucide-react";
import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { postStore, profileStore } from "@/store/reducers";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { IMGAES_URL } from "@/global-config";
import { useTranslation } from "react-i18next";

interface CommentProps {
  id: string;
  avatarUrl?: string;
  authorId?: string;
  author: string;
  content: string;
  hasLiked?: boolean;
  likedCount: number;
}

const LikeIcon = styled(({ hasLiked, ...props }) => <Heart {...props} />)`
  margin-right: 0.25rem;
  width: 20px;
  height: 20px;
  color: ${(props) => (props.hasLiked ? "red" : "inherit")};
  fill: ${(props) => (props.hasLiked ? "red" : "none")};
`;

const StatItem = styled.button`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  background: none;
  border: none;
  padding: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #4b5563;
  }
`;

export const PostComment: React.FC<CommentProps> = ({
  id,
  avatarUrl = "/img/avatar_default.jpg",
  authorId,
  author = "John Doe",
  content = "This is a comment",
  hasLiked = false,
  likedCount = 0,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentUser = useSelector(profileStore.selectCurrentUser);

  const handleLikeComment = () => {
    if (!hasLiked) {
      dispatch(postStore.likeComment(id));
    } else {
      dispatch(postStore.unlikeComment(id));
    }
  };

  const handleDeleteComment = () => {
    dispatch(postStore.deleteComment(id));
  };

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <img
        src={avatarUrl ? IMGAES_URL + avatarUrl : "/img/avatar_default.jpg"}
        alt={`${author}'s avatar`}
        className="w-10 h-10 rounded-full bg-gray-600 object-cover"
      />

      {/* Comment Content */}
      <div className="flex flex-col">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              backgroundColor: "var(--background-comment)",
              borderRadius: "0.5rem",
              padding: "0.5rem",
            }}
          >
            <div
              className="font-bold text-white"
              style={{ color: "var(--foreground)" }}
            >
              {author}
            </div>
            <p className="text-gray-400 mb-2" style={{ color: "grey" }}>
              {content}
            </p>
          </Box>
          {currentUser?.id === authorId && (
            <IconButton
              edge="end"
              color="inherit"
              disableRipple
              disableFocusRipple
              onClick={handleDeleteComment}
            >
              <DeleteIcon sx={{ color: "var(--foreground)" }} />
            </IconButton>
          )}
        </Box>

        {/* Actions */}
        <div className="flex gap-4 text-gray-500 text-sm">
          <StatItem
            className={hasLiked ? "active" : ""}
            onClick={handleLikeComment}
          >
            <LikeIcon hasLiked={hasLiked} />
            <Typography variant="body1">
              {likedCount} {t("posts.Likes")}
            </Typography>
            {/* </div> */}
          </StatItem>
        </div>
      </div>
    </div>
  );
};
