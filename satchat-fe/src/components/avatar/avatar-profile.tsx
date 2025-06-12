"use client";

import { useRef, useState } from "react";
import { Avatar } from "./avatar";
import CameraIcon from "@/components/icons/camera";
import backendClient from "@/utils/BackendClient";
import { useDispatch } from "react-redux";
import { commonStore } from "@/store/reducers";

interface AvatarProfileProps {
  avatar?: string;
  canEdit: boolean;
}
export const AvatarProfile = ({ avatar, canEdit }: AvatarProfileProps) => {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUpdateAvatar = async (file: File) => {
    try {
      const response: any = await backendClient.setAvatar(file);
      if (!response) {
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      dispatch(
        commonStore.actions.setSuccessMessage("Avatar updated successfully")
      );
    } catch (error) {
      console.error("Error uploading avatar:", error);
      dispatch(commonStore.actions.setErrorMessage("Failed to update avatar"));
    } finally {
      setIsDialogOpen(false);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpdateAvatar(selectedFile);
    }
  };
  return (
    <>
      <div
        className={`w-fit absolute flex justify-center items-center left-[20px] -bottom-[36px] z-1 rounded-full border-[4px] border-[#303030] overflow-hidden ${
          canEdit &&
          'after:content-[""] after:absolute after:bg-[#12121299] after:inset-0'
        }`}
      >
        <Avatar
          size={80}
          src={previewUrl || avatar}
          alt="Avatar"
          className="size-[44px] ring-2 w-20 h-20 ring-offset-2 ring-neutral2-10"
        />

        {canEdit && (
          <>
            <button
              className="absolute z-[2] hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-[#12121299] hover:bg-[#121212] transition-all duration-200 ease-in-out"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <CameraIcon />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </>
  );
};
