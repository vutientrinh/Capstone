"use client";

import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import "./styles.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  commonStore,
  postStore,
  profileStore,
  topicStore,
} from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { IMGAES_URL } from "@/global-config";
import { useTranslation } from "react-i18next";

export const NewPostDialog = ({
  open,
  setOpen,
  post,
  isEdit = false,
}: {
  open: boolean;
  setOpen: any;
  post?: {
    id: string;
    content: string;
    images: string[];
    topicId: string;
    status: string;
    type: string;
  };
  isEdit?: boolean;
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const topics = useSelector(topicStore.selectTopics);
  // Params
  const currentUser = useSelector(profileStore.selectCurrentUser) as any;
  const [selectedTopic, setSelectedTopic] = useState<string>(
    post?.topicId || ""
  );
  const [content, setContent] = useState<string>(post?.content || "");
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    dispatch(topicStore.getTopics());
  }, [dispatch]);

  useEffect(() => {
    const fetchImages = async () => {
      if (post?.images?.length) {
        const files = await Promise.all(
          post.images.map(async (url) => {
            const response = await fetch(IMGAES_URL + url);
            const blob = await response.blob();
            return new File([blob], "image.jpg", { type: blob.type });
          })
        );
        setImages(files);
      }
    };
    fetchImages();
  }, [post]);

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        setImages([...images, ...files]);
      }
      document.body.removeChild(input);
    });

    input.click();
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onChangeTopic = (event: any) => {
    setSelectedTopic(event.target.value);
  };

  const handleSubmit = async () => {
    // Validation
    if (content.trim() === "") {
      dispatch(
        commonStore.actions.setErrorMessage("Please enter a post content.")
      );
      return;
    }
    if (selectedTopic === "") {
      dispatch(commonStore.actions.setErrorMessage("Please select a topic."));
      return;
    }
    // API Calling
    try {
      if (!isEdit) {
        const newPostPayload = {
          content,
          images,
          authorId: currentUser?.id,
          topicId: selectedTopic,
        };
        const response = await backendClient.createNewPost(newPostPayload);
        const newPost = response?.data.data;
        dispatch(postStore.actions.createPost(newPost));
      } else {
        const updatePayload: {
          content: string;
          topicId: string;
          status: string;
          type: string;
          images?: File[];
        } = {
          content,
          topicId: selectedTopic,
          status: post?.status || "PUBLIC",
          type: post?.type || "TEXT",
        };
        if (Array.isArray(images) && images.length > 0) {
          updatePayload.images = images;
        }
        const response = await backendClient.updatePost(
          post?.id,
          updatePayload
        );
        const updatedPost = response?.data.data;
        dispatch(postStore.actions.updatePost(updatedPost));
      }
      setOpen((prev: any) => !prev);
    } catch (error) {
      console.error("Error creating post:", error);
      dispatch(
        commonStore.actions.setErrorMessage("Unexpected error occurred.")
      );
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="create-post-container">
        <div className="header-card">
          <button
            className="back-button"
            onClick={() => setOpen((prev: any) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              color="var(--foreground)"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="title">
            <Typography variant="h6" component="h2">
              <strong>
                {isEdit ? t("posts.EditPost") : t("posts.CreatePost")}
              </strong>
            </Typography>
          </div>
        </div>

        <Divider sx={{ color: "var(--foreground)" }} />
        <div className="post-content">
          <textarea
            className="post-textarea"
            placeholder={t("posts.Content")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="post-actions">
            <button className="action-button" onClick={handleUploadClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <button className="action-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </button>
            <button className="action-button emoji-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
          </div>
        </div>

        <div className="attachments">
          {images.map((file, index) => (
            <div key={index} className="attachment">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="attachment-image"
              />
              <div
                className="remove-attachment"
                onClick={() => removeImage(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="post-footer">
          <Select
            size="small"
            sx={{
              background: "var(--button-hover)",
              border: "none",
              borderRadius: 2,
            }}
            value={selectedTopic}
            onChange={onChangeTopic}
            defaultValue={topics.length > 0 ? topics[0].id : ""}
          >
            {topics.map((topic: any) => (
              <MenuItem key={topic.id} value={topic.id}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: topic.color,
                    display: "inline-block",
                    marginRight: 8,
                  }}
                ></span>
                {topic.name}
              </MenuItem>
            ))}
          </Select>

          <div className="button-group">
            <button
              className="cancel-button"
              onClick={() => setOpen((prev: any) => !prev)}
            >
              {t("posts.Cancel")}
            </button>
            <button className="publish-button" onClick={handleSubmit}>
              {isEdit ? t("posts.Update") : t("posts.Publish")}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
