import React from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import { postStore, profileStore } from "@/store/reducers";
import { relativeTime } from "@/utils/relative-time";
import { Slides } from "@/components/slides";
import styled from "styled-components";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { IMGAES_URL } from "@/global-config";
import { useTranslation } from "react-i18next";

// Styled components
const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #d1d5db;
  overflow: hidden;
  margin-right: 0.75rem;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: var(--foreground);
`;

const AuthorMeta = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const PostContent = styled.div`
  margin-bottom: 0.75rem;
`;

const ContentText = styled.p`
  color: var(--foreground);
`;

const ImageContainer = styled.div`
  margin-bottom: 0.75rem;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
`;

const TopicTag = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  color: #ffffff;
  margin-bottom: 0.75rem;
`;

const InteractionStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #6b7280;
  font-size: 0.875rem;
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

const LikeIcon = styled(({ hasLiked, ...props }) => <Heart {...props} />)`
  margin-right: 0.25rem;
  width: 20px;
  height: 20px;
  color: ${(props) => (props.hasLiked ? "red" : "inherit")};
  fill: ${(props) => (props.hasLiked ? "red" : "none")};
`;

const BookmarkIcon = styled(({ hasLiked, ...props }) => (
  <Bookmark {...props} />
))`
  margin-right: 0.25rem;
  width: 20px;
  height: 20px;
  color: ${(props) => (props.hasLiked ? "#7E1891" : "inherit")};
  fill: ${(props) => (props.hasLiked ? "#7E1891" : "none")};
`;

const CommentIcon = styled(MessageCircle)`
  margin-right: 0.25rem;
  width: 20px;
  height: 20px;
`;

interface PostContentDetailsProps {
  post: any;
  setEdit: (value: any) => void;
}

export const PostContentDetail: React.FC<PostContentDetailsProps> = ({
  post,
  setEdit,
}) => {
  console.log("PostContentDetail", post);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentUser = useSelector(profileStore.selectCurrentUser);
  const timeAgo = relativeTime(new Date(post.createdAt));

  const handleLikePost = (post: any) => () => {
    if (post.hasLiked) {
      dispatch(postStore.unlikePost(post.id));
    } else {
      dispatch(postStore.likePost(post.id));
    }
  };

  const handleBookmarkPost = (post: any) => () => {
    if (!post.hasSaved) {
      dispatch(postStore.savePost(currentUser?.id, post.id));
    } else {
      dispatch(postStore.unSavePost(currentUser?.id, post.id));
    }
  };

  const handleDeletePost = (postId: string) => () => {
    dispatch(postStore.deletePost(postId));
  };

  return (
    <>
      {/* Author info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AuthorSection>
          <Avatar>
            <AvatarImage
              src={IMGAES_URL + post.author.avatar}
              alt={post.author.username}
            />
          </Avatar>
          <AuthorInfo>
            <AuthorName>
              {post.author.firstName} {post.author.lastName}
            </AuthorName>
            <AuthorMeta>
              @{post.author.username} · {timeAgo}
            </AuthorMeta>
          </AuthorInfo>
        </AuthorSection>
        {currentUser.id === post.author.id && (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <IconButton
              component="span"
              onClick={() => setEdit((prev: any) => !prev)}
            >
              <EditIcon sx={{ color: "var(--foreground)" }} />
            </IconButton>
            <IconButton onClick={handleDeletePost(post.id)}>
              <RemoveCircleOutlineIcon sx={{ color: "var(--foreground)" }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Post content */}
      <PostContent>
        <ContentText>{post.content}</ContentText>
      </PostContent>

      {/* Post image if available */}
      {post.images && post.images.length > 0 && (
        <ImageContainer>
          <Slides images={post.images} />
        </ImageContainer>
      )}

      {/* Topic tag */}
      <TopicTag style={{ backgroundColor: post.topic.color || "#000000" }}>
        {post.topic.name}
      </TopicTag>

      <Divider sx={{ bgcolor: "var(--foreground)" }} />

      {/* Interaction stats */}
      <InteractionStats>
        {/* Liked post */}
        <StatItem
          className={post.hasLiked ? "active" : ""}
          onClick={handleLikePost(post)}
        >
          <LikeIcon hasLiked={post.hasLiked} />
          <Typography variant="body1">
            {post.likedCount} {t("posts.Likes")}
          </Typography>
        </StatItem>
        {/* Comment post */}
        <StatItem
          onClick={() => {
            dispatch(postStore.actions.setDisplayCurrentPost(true));
            dispatch(postStore.actions.setCurrentPost(post));
          }}
        >
          <CommentIcon />
          <Typography variant="body1">
            {post.commentCount} {t("posts.Comments")}
          </Typography>
        </StatItem>
        {/* Bookmark */}
        <StatItem
          className={post.hasSaved ? "active" : ""}
          onClick={handleBookmarkPost(post)}
        >
          <BookmarkIcon hasLiked={post.hasSaved} />
          <Typography variant="body1">{t("posts.Bookmark")}</Typography>
        </StatItem>
      </InteractionStats>
    </>
  );
};
