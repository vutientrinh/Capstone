import { postStore } from "@/store/reducers";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { CommentBar, PostCard, PostComment } from "@/sections/post";
import { useEffect } from "react";

export const PostDialog = () => {
  const dispatch = useDispatch();
  const displayDetailPost = useSelector(postStore.selectDisplayCurrentPost);
  const currentPost = useSelector(postStore.selectCurrentPost);
  const postComments = useSelector(postStore.selectCurrentPostComments);

  useEffect(() => {
    if (displayDetailPost) {
      dispatch(postStore.getPostComments(currentPost.id));
    }
  }, [displayDetailPost]);

  return (
    <Dialog
      open={displayDetailPost}
      onClose={() => {
        dispatch(postStore.actions.setDisplayCurrentPost(false));
      }}
      fullScreen
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "800px",
          background: "var(--background-component)",
        },
      }}
    >
      <AppBar
        position="static"
        sx={{ background: "var(--background-component)" }}
      >
        <Toolbar>
          {/* Navbar Title */}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: "var(--foreground)" }}
          >
            Bài viết
          </Typography>

          {/* Close Button */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => {
              dispatch(postStore.actions.setDisplayCurrentPost(false));
            }}
          >
            <HighlightOffIcon sx={{ color: "var(--foreground)" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <PostCard key={currentPost.id} post={currentPost} />
        {displayDetailPost && (
          <>
            <Divider sx={{ bgcolor: "var(--foreground)", marginBottom: 3 }} />
            <CommentBar post={currentPost} />
            {postComments.map((comment: any) => (
              <PostComment
                key={comment?.id}
                id={comment?.id}
                avatarUrl={comment?.author?.avatar ?? ""}
                authorId={comment?.author?.id ?? ""}
                author={
                  comment?.author
                    ? `${comment.author.firstName ?? ""} ${
                        comment.author.lastName ?? ""
                      }`
                    : "Ẩn danh"
                }
                content={comment?.content ?? ""}
                hasLiked={comment?.hasLiked ?? false}
                likedCount={comment?.likedCount ?? 0}
              />
            ))}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
