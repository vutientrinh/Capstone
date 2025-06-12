import { AvatarProfile } from "@/components/avatar";
import { CoverImage } from "@/components/cover";
import { CheckIcon, EditIcon, ShareIcon } from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { IMGAES_URL } from "@/global-config";
import { commonStore, profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Button, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IUserProps {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isFollowed: boolean;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  cover?: string;
}

export const InfoUser: React.FC<IUserProps> = ({
  id,
  username,
  firstName,
  lastName,
  avatar,
  isFollowed,
  edit,
  setEdit,
  cover,
}) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(profileStore.selectCurrentUser);
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const [localIsFollowed, setLocalIsFollowed] = React.useState(isFollowed);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    dispatch(profileStore.getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    setLocalIsFollowed(isFollowed);
  }, [isFollowed]);

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${id}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      dispatch(commonStore.actions.setErrorMessage("Failed to copy link"));
    }
  };

  const handleFollow = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newFollowState = !localIsFollowed;
    setLocalIsFollowed(newFollowState);

    try {
      if (localIsFollowed) {
        await backendClient.unFollowUser(id);
        dispatch(
          commonStore.actions.setSuccessMessage("Unfollowed user successfully")
        );
      } else {
        await backendClient.followUser(id);
        dispatch(
          commonStore.actions.setSuccessMessage("Followed user successfully")
        );
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      setLocalIsFollowed(localIsFollowed);
      dispatch(
        commonStore.actions.setErrorMessage("Failed to follow/unfollow user")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full relative z-[2]">
        {/* Cover Image */}
        <div className="relative">
          <CoverImage src={cover} canEdit={edit} />
          <div className="absolute left-6 bottom-[-2.5rem]">
            <AvatarProfile
              avatar={avatar ? IMGAES_URL + avatar : "/img/avatar_default.jpg"}
              canEdit={edit}
            />
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="w-full flex items-center justify-between gap-5 p-9 mt-12 relative z-[2]">
          <div id="profile-info-header" className="flex items-center gap-2">
            <div className="opacity-80">
              <Typography className="text-primary text-2xl font-bold">
                <strong>{firstName + " " + lastName}</strong>
              </Typography>
              <Typography className="text-tertiary text-base">
                @{username}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <IconButton
              className="w-10 h-10 flex items-center justify-center border-2"
              style={{
                borderRadius: "50%",
                backgroundColor: "var(--button-hover)",
              }}
              onClick={handleShare}
            >
              {isCopied ? (
                <CheckIcon color={"var(--foreground)"} />
              ) : (
                <ShareIcon width={20} height={20} color={"var(--foreground)"} />
              )}
            </IconButton>

            {/* Nút Follow/Unfollow */}
            {id !== userProfile?.id && (
              <Button
                onClick={handleFollow}
                className="
      px-6 py-2.5 mr-2 
      font-medium text-sm 
      rounded-full 
      transition-all duration-200 ease-in-out
      transform hover:scale-105 active:scale-95
      shadow-sm hover:shadow-md
      border-2
    "
                style={{
                  textTransform: "none",
                  backgroundColor: localIsFollowed
                    ? "transparent"
                    : "var(--primary)",
                  borderColor: "var(--foreground)",
                  borderWidth: "2px",
                  color: "var(--foreground)",
                }}
              >
                <span className="flex items-center gap-2">
                  {localIsFollowed ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Following
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Follow
                    </>
                  )}
                </span>
              </Button>
            )}
            {id === userProfile?.id && (
              <Link href={`/profile/${id}/edit`}>
                <Button
                  className="hidden md:flex items-center gap-2 px-5 py-2 mr-2 border-2"
                  style={{
                    backgroundColor: "var(--button-hover)",
                    borderRadius: "999px",
                    color: "var(--foreground)",
                    textTransform: "none",
                  }}
                >
                  <EditIcon color="var(--foreground)" />
                  <span
                    className="text-base font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    Edit profile
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
