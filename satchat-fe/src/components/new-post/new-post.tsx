import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { NewPostDialog } from "../new-post-dialog";
import { useState } from "react";

export const NewPost = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen((prev) => !prev)}>
        <AddCircleOutlineIcon sx={{ color: "var(--foreground)" }} />
      </IconButton>
      <NewPostDialog open={open} setOpen={setOpen} />
    </>
  );
};
