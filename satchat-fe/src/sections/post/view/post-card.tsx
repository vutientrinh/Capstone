import React, { useState } from "react";
import { useSelector } from "react-redux";
import { postStore } from "@/store/reducers";
import { PostContentDetail } from "../index";
import { NewPostDialog } from "@/components/new-post-dialog";
import styled from "styled-components";

const Card = styled.div`
  background-color: var(--background-component);
  border-radius: 0.5rem;
  box-shadow: 1px 2px 4px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 1rem 0;
`;

const PostCard = React.forwardRef(({ post }: any, ref: any) => {
  const [edit, setEdit] = useState(false);
  const displayDetailPost = useSelector(postStore.selectDisplayCurrentPost);

  return (
    <>
      {displayDetailPost ? (
        <PostContentDetail post={post} setEdit={setEdit} />
      ) : (
        <Card ref={ref}>
          <PostContentDetail post={post} setEdit={setEdit} />
        </Card>
      )}
      {edit && (
        <NewPostDialog
          key={post.id}
          open={edit}
          setOpen={setEdit}
          post={post}
          isEdit={true}
        />
      )}
    </>
  );
});

// Add display name for React DevTools
PostCard.displayName = "PostCard";

export default PostCard;
